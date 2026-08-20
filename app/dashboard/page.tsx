import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f3fb] p-6">
      <section className="w-full max-w-xl rounded-[28px] border border-white/80 bg-white p-8 shadow-[0_24px_80px_rgba(45,35,93,0.12)] sm:p-12">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#755bd6]">SIGNED IN</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-[#1d1e32]">
          Welcome, {session.user.name ?? "there"}
        </h1>
        <p className="mt-3 text-[#7c7d8f]">{session.user.email}</p>
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="rounded-xl bg-[#1d1e32] px-5 py-3 font-semibold text-white transition hover:bg-[#303149]" type="submit">Sign out</button>
        </form>
      </section>
    </main>
  );
}
