"use client";

import { useFormStatus } from "react-dom";
import { continueWithGoogle } from "../actions/auth";

function GoogleSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-[#ddd9e8] bg-white px-5 font-semibold text-[#303144] shadow-sm transition hover:border-[#c7c0dc] hover:bg-[#faf9fd] focus:outline-none focus:ring-4 focus:ring-[#6d53d2]/15 disabled:cursor-wait disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#6d53d2]/30 border-t-[#6d53d2]" />
      ) : (
        <span className="grid h-5 w-5 grid-cols-2 overflow-hidden rounded-full" aria-hidden="true">
          <span className="bg-[#4285f4]" />
          <span className="bg-[#ea4335]" />
          <span className="bg-[#fbbc05]" />
          <span className="bg-[#34a853]" />
        </span>
      )}
      {pending ? "Connecting to Google…" : "Continue with Google"}
    </button>
  );
}

export function GoogleAuthButton() {
  return (
    <form action={continueWithGoogle}>
      <GoogleSubmitButton />
    </form>
  );
}
