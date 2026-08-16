import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EVC — Your work, beautifully organized", template: "%s | EVC" },
  description: "Create your EVC account and bring your best work into focus.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>{children}</body>
    </html>
  );
}
