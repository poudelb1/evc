"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowIcon, MailIcon } from "../components/icons";
import { FormInput } from "../components/form-field";
import { PasswordField } from "../components/password-field";

export function LoginForm() {
  const [notice, setNotice] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setNotice(true); }
  return <div className="w-full">
    <div className="mb-9"><p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[#755bd6]">GOOD TO SEE YOU</p><h2 className="text-[34px] font-semibold tracking-[-0.045em] text-[#1d1e32] sm:text-[40px]">Welcome back</h2><p className="mt-3 text-[15px] leading-6 text-[#7c7d8f]">Enter your details to access your workspace.</p></div>
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormInput label="Email address" name="email" type="email" required autoComplete="email" placeholder="alex@example.com" icon={<MailIcon className="h-5 w-5"/>}/>
      <div><PasswordField label="Password" name="password" required autoComplete="current-password" placeholder="Enter your password"/><div className="mt-3 flex items-center justify-between"><label className="flex items-center gap-2 text-[13px] text-[#6f7082]"><input type="checkbox" className="h-4 w-4 rounded border-[#d5d2e0] accent-[#6d53d2]"/>Remember me</label><a href="#" className="text-[13px] font-semibold text-[#654bc7] hover:text-[#4f35ad]">Forgot password?</a></div></div>
      {notice && <p role="status" className="rounded-xl border border-[#dcd4f8] bg-[#f5f2ff] px-4 py-3 text-sm text-[#5943ae]">Login authentication is the next backend step. Your registration is ready to use.</p>}
      <button className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#6d53d2] px-5 font-semibold text-white shadow-[0_10px_24px_rgba(109,83,210,0.24)] transition hover:bg-[#5d43c2] focus:outline-none focus:ring-4 focus:ring-[#6d53d2]/20" type="submit">Sign in <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5"/></button>
      <p className="pt-3 text-center text-sm text-[#77788b]">Don&apos;t have an account? <Link href="/register" className="font-semibold text-[#6046c4] hover:text-[#4932a7]">Create one free</Link></p>
    </form>
  </div>;
}
