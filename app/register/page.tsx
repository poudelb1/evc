import type { Metadata } from "next";
import { AuthShell } from "../components/auth-shell";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Create account" };
export default function RegisterPage() { return <AuthShell mode="register"><RegisterForm/></AuthShell>; }
