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
            toastOptions={{ style: { background: "#232323", color: "#fff" } }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
