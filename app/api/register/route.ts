import { hash } from "bcryptjs";
import { MongoServerError } from "mongodb";
import { getMongoClient } from "@/lib/mongodb";

export const runtime = "nodejs";

const genders = new Set(["female", "male", "non-binary", "prefer-not-to-say"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RegisterBody = { name?: unknown; email?: unknown; gender?: unknown; password?: unknown; confirmPassword?: unknown };

export async function POST(request: Request) {
  let body: RegisterBody;
  try { body = await request.json() as RegisterBody; }
  catch { return Response.json({ message: "Invalid request body." }, { status: 400 }); }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const gender = typeof body.gender === "string" ? body.gender : "";
  const password = typeof body.password === "string" ? body.password : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  if (name.length < 2 || name.length > 100) return Response.json({ message: "Name must be between 2 and 100 characters." }, { status: 400 });
  if (email.length > 254 || !emailPattern.test(email)) return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
  if (!genders.has(gender)) return Response.json({ message: "Please select a valid gender." }, { status: 400 });
  if (password.length < 8 || password.length > 128) return Response.json({ message: "Password must be between 8 and 128 characters." }, { status: 400 });
  if (password !== confirmPassword) return Response.json({ message: "Passwords do not match." }, { status: 400 });

  try {
    const client = await getMongoClient();
    const users = client.db(process.env.MONGODB_DB ?? "evc").collection("users");
    await users.createIndex({ email: 1 }, { unique: true });
    const passwordHash = await hash(password, 12);
    await users.insertOne({ name, email, gender, passwordHash, createdAt: new Date(), updatedAt: new Date() });
    return Response.json({ message: "Account created successfully." }, { status: 201 });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) return Response.json({ message: "An account with this email already exists." }, { status: 409 });
    console.error("Registration failed", error);
    return Response.json({ message: "Unable to create your account right now." }, { status: 500 });
  }
}
