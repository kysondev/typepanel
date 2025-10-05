import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildLLM",
  description:
    "Self-hosted platform to create, customize, and share AI chatbots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
