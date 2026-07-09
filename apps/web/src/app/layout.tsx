import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Manrope } from "next/font/google";
import "./globals.css";
import { AppNav, AppNavSpacer } from "@/components/app-nav";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Better Days",
  description:
    "A recovery companion that helps you understand your habits and celebrate progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${atkinson.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <AppNav />
          {children}
          <AppNavSpacer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
