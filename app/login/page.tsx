import type { Metadata } from "next";
import { AuthShell } from "../components/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };
export default function LoginPage() { return <AuthShell mode="login"><LoginForm/></AuthShell>; }
