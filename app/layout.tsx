import type { Metadata } from "next";
import "@common/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "TypePanel",
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
      <body className={`antialiased ${raleway.variable} font-sans`}>
        <div>
          <Toaster
            position="top-right"
            toastOptions={{
              className: raleway.variable,
              style: {
                background: "#0A0A0A",
                color: "#fff",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "12px 20px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
