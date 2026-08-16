import Link from "next/link";
import { CheckIcon, LogoMark } from "./icons";

type AuthShellProps = { children: React.ReactNode; mode: "register" | "login" };
const copy = {
  register: { eyebrow: "JOIN THOUSANDS OF TEAMS", title: <>Everything you need<br/>to do your best work.</>, description: "One calm space to plan, collaborate, and turn your biggest ideas into meaningful progress.", points: ["Simple from day one", "Built for focused teams", "Your data stays yours"] },
  login: { eyebrow: "WELCOME BACK", title: <>Pick up right where<br/>you left off.</>, description: "Your projects, ideas, and team are ready. Sign in and get back into your flow.", points: ["Everything in one place", "Secure by design", "Made for momentum"] },
};

export function AuthShell({ children, mode }: AuthShellProps) {
  const content = copy[mode];
  return <main className="relative min-h-screen overflow-hidden bg-[#f5f3fb] p-3 sm:p-6 lg:p-8">
    <div className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-[#e5defe] blur-3xl"/>
    <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#ded9f7] blur-3xl"/>
    <section className="relative mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1280px] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_24px_80px_rgba(45,35,93,0.12)] sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="relative hidden overflow-hidden bg-[#17182c] p-10 text-white lg:flex lg:flex-col xl:p-14">
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_15%_20%,#735dd0_0,transparent_29%),radial-gradient(circle_at_90%_90%,#42376f_0,transparent_35%)]"/>
        <div className="absolute -right-28 top-24 h-72 w-72 rounded-full border border-white/[0.06]"/><div className="absolute -right-10 top-44 h-36 w-36 rounded-full border border-white/[0.06]"/>
        <Link href="/" className="relative flex items-center gap-3 text-xl font-semibold tracking-[-0.03em]" aria-label="EVC home"><LogoMark className="h-9 w-9 text-[#8b72ec]"/><span>EVC</span></Link>
        <div className="relative my-auto py-14">
          <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-[#a896ef]">{content.eyebrow}</p>
          <h1 className="text-[clamp(2.65rem,4vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.055em]">{content.title}</h1>
          <p className="mt-7 max-w-md text-[17px] leading-7 text-[#b5b4c5]">{content.description}</p>
          <ul className="mt-9 space-y-4">{content.points.map(point => <li key={point} className="flex items-center gap-3 text-sm text-[#d3d2df]"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#7060bd]/35 text-[#b9a9fa]"><CheckIcon className="h-3.5 w-3.5"/></span>{point}</li>)}</ul>
        </div>
        <p className="relative text-xs text-[#77778b]">© 2026 EVC. Thoughtfully made for focused work.</p>
      </aside>
      <div className="flex min-h-full flex-col px-6 py-7 sm:px-12 sm:py-9 xl:px-24">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight lg:hidden"><LogoMark className="h-8 w-8 text-[#7056d9]"/> EVC</Link>
          <p className="text-sm text-[#77788b]">{mode === "register" ? "Already a member?" : "New to EVC?"} <Link className="font-semibold text-[#6046c4] hover:text-[#4932a7]" href={mode === "register" ? "/login" : "/register"}>{mode === "register" ? "Sign in" : "Create account"}</Link></p>
        </div>
        <div className="mx-auto flex w-full max-w-[500px] flex-1 items-center py-10">{children}</div>
      </div>
    </section>
  </main>;
}
