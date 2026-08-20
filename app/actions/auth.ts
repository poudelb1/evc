"use server";

import { signIn } from "@/auth";

export async function continueWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}
