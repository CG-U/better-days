import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Manrope } from "next/font/google";
import "./globals.css";
import { AppNav, AppNavSpacer } from "@/components/app-nav";
import { SlowRequestIndicator } from "@/components/slow-request-indicator";
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
    // suppressHydrationWarning: next-themes stamps the theme class onto <html>
    // before paint, so the server markup intentionally differs by one class.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${atkinson.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <AppNav />
          {children}
          <AppNavSpacer />
          <SlowRequestIndicator />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
