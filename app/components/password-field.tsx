"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { EyeIcon, EyeOffIcon, LockIcon } from "./icons";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };
export function PasswordField({ label, error, ...props }: Props) {
  const [visible, setVisible] = useState(false);
  return <label className="block">
    <span className="mb-2 block text-[13px] font-semibold text-[#343548]">{label}</span>
    <span className={`group flex h-[52px] items-center gap-3 rounded-xl border bg-white px-4 transition focus-within:border-[#765cdf] focus-within:ring-4 focus-within:ring-[#765cdf]/10 ${error ? "border-red-400" : "border-[#dedce7]"}`}>
      <LockIcon className="h-5 w-5 shrink-0 text-[#9999a9] transition group-focus-within:text-[#7056d9]"/>
      <input {...props} type={visible ? "text" : "password"} className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-[#222337] outline-none placeholder:text-[#aaaab7]" aria-invalid={Boolean(error)}/>
      <button type="button" onClick={() => setVisible(value => !value)} className="grid h-8 w-8 place-items-center rounded-lg text-[#9999a9] transition hover:bg-[#f2effc] hover:text-[#654ccb]" aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}</button>
    </span>
    {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
  </label>;
}
