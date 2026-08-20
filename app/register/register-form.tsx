"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowIcon, CheckIcon, MailIcon, UserIcon, UsersIcon } from "../components/icons";
import { FormInput, FormSelect } from "../components/form-field";
import { PasswordField } from "../components/password-field";
import { GoogleAuthButton } from "../components/google-auth-button";

type Fields = "name" | "email" | "gender" | "password" | "confirmPassword";
type Errors = Partial<Record<Fields | "form", string>>;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(form: FormData) {
    const next: Errors = {};
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const gender = String(form.get("gender") ?? "");
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    if (name.length < 2) next.name = "Please enter your full name.";
    if (!emailPattern.test(email)) next.email = "Enter a valid email address.";
    if (!gender) next.gender = "Please select your gender.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (confirmPassword !== password) next.confirmPassword = "Passwords do not match.";
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const nextErrors = validate(formData);
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    setErrors({}); setSubmitting(true);
    try {
      const response = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData)) });
      const data = await response.json() as { message?: string };
      if (!response.ok) { setErrors({ form: data.message ?? "We couldn't create your account." }); return; }
      formElement.reset(); setSuccess(true);
      window.setTimeout(() => router.push("/login"), 1200);
    } catch {
      setErrors({ form: "Unable to reach the server. Please try again." });
    } finally { setSubmitting(false); }
  }

  return <div className="w-full">
    <div className="mb-8"><p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[#755bd6]">GET STARTED</p><h2 className="text-[34px] font-semibold tracking-[-0.045em] text-[#1d1e32] sm:text-[40px]">Create your account</h2><p className="mt-3 text-[15px] leading-6 text-[#7c7d8f]">A few details and you&apos;ll be ready to go.</p></div>
    {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white"><CheckIcon className="h-6 w-6"/></span><h3 className="mt-4 text-lg font-semibold text-emerald-950">Account created</h3><p className="mt-1 text-sm text-emerald-700">Taking you to sign in…</p></div> : <>
    <GoogleAuthButton />
    <div className="my-5 flex items-center gap-4 text-xs font-medium uppercase tracking-[0.12em] text-[#a1a1ae]"><span className="h-px flex-1 bg-[#e7e4ed]"/><span>or use email</span><span className="h-px flex-1 bg-[#e7e4ed]"/></div>
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2"><FormInput label="Full name" name="name" autoComplete="name" placeholder="Alex Morgan" icon={<UserIcon className="h-5 w-5"/>} error={errors.name}/><FormSelect label="Gender" name="gender" defaultValue="" required icon={<UsersIcon className="h-5 w-5"/>} error={errors.gender}><option value="" disabled>Select gender</option><option value="female">Female</option><option value="male">Male</option><option value="non-binary">Non-binary</option><option value="prefer-not-to-say">Prefer not to say</option></FormSelect></div>
      <FormInput label="Email address" name="email" type="email" autoComplete="email" inputMode="email" placeholder="alex@example.com" icon={<MailIcon className="h-5 w-5"/>} error={errors.email}/>
      <div className="grid gap-4 sm:grid-cols-2"><PasswordField label="Password" name="password" autoComplete="new-password" placeholder="8+ characters" error={errors.password}/><PasswordField label="Confirm password" name="confirmPassword" autoComplete="new-password" placeholder="Repeat password" error={errors.confirmPassword}/></div>
      {errors.form && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>}
      <button disabled={submitting} className="group mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#6d53d2] px-5 font-semibold text-white shadow-[0_10px_24px_rgba(109,83,210,0.24)] transition hover:bg-[#5d43c2] focus:outline-none focus:ring-4 focus:ring-[#6d53d2]/20 disabled:cursor-wait disabled:opacity-70" type="submit">{submitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"/>Creating account…</> : <>Create account <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5"/></>}</button>
      <p className="pt-1 text-center text-xs leading-5 text-[#9696a5]">By creating an account, you agree to our <a href="#" className="underline underline-offset-2 hover:text-[#6046c4]">Terms</a> and <a href="#" className="underline underline-offset-2 hover:text-[#6046c4]">Privacy Policy</a>.</p>
    </form></>}
  </div>;
}
