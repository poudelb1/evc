import { compare } from "bcryptjs";
import { MongoServerError } from "mongodb";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getMongoClient } from "@/lib/mongodb";

type StoredUser = {
  name: string;
  email: string;
  passwordHash?: string;
  image?: string | null;
  googleSubject?: string;
  authProviders?: string[];
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt" },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";

        if (!emailPattern.test(email) || password.length < 8 || password.length > 128) {
          return null;
        }

        const client = await getMongoClient();
        const user = await client
          .db(process.env.MONGODB_DB ?? "evc")
          .collection<StoredUser>("users")
          .findOne({ email });

        if (!user?.passwordHash || !(await compare(password, user.passwordHash))) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider !== "google") return true;

      const googleSubject = profile?.sub;
      if (
        profile?.email_verified !== true ||
        !user.email ||
        typeof googleSubject !== "string" ||
        !googleSubject
      ) return false;

      const email = user.email.trim().toLowerCase();
      const client = await getMongoClient();
      const users = client
        .db(process.env.MONGODB_DB ?? "evc")
        .collection<StoredUser>("users");
      await users.createIndex({ email: 1 }, { unique: true });

      const existingUser = await users.findOne({ email });
      if (existingUser) {
        // A verified Google email may link a credentials account, but an email
        // already linked to another Google identity must never be reassigned.
        if (existingUser.googleSubject && existingUser.googleSubject !== googleSubject) {
          return false;
        }

        await users.updateOne(
          { _id: existingUser._id },
          {
            $set: {
              googleSubject,
              image: user.image ?? existingUser.image ?? null,
              updatedAt: new Date(),
            },
            $addToSet: { authProviders: "google" },
          },
        );
        return true;
      }

      const now = new Date();
      try {
        await users.insertOne({
          email,
          name: user.name ?? email.split("@")[0],
          image: user.image ?? null,
          googleSubject,
          authProviders: ["google"],
          createdAt: now,
          updatedAt: now,
        } as StoredUser & { createdAt: Date; updatedAt: Date });
      } catch (error) {
        if (!(error instanceof MongoServerError) || error.code !== 11000) throw error;

        // Handle a concurrent first sign-in without authorizing a different
        // Google identity that raced to claim the same email.
        const concurrentUser = await users.findOne({ email });
        if (concurrentUser?.googleSubject !== googleSubject) return false;
      }

      return true;
    },
  },
});
