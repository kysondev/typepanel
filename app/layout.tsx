import type { Metadata } from "next";
import "@common/styles/globals.css";
import { Toaster } from "react-hot-toast";

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
      <body className={`antialiased`}>
        <div>
          <Toaster
            toastOptions={{ style: { background: "#232323", color: "#fff" } }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
