import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { StorageBanner } from "@/components/storage-banner";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { template: "%s · Bill Splitter", default: "Bill Splitter" },
  description: "Split meals, rides and recurring bills with friends, roommates and your partner. Saved on your phone only.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-3 focus:font-semibold"
        >
          Skip to main content
        </a>
        <header className="border-b border-line bg-surface">
          <div className="mx-auto max-w-xl px-4 py-1">
            {/* No tabs: Home's quick starts cover them. The app name is the way back to Home. */}
            <Link href="/" className="inline-flex min-h-11 items-center text-lg font-bold text-ink">
              Bill Splitter<span className="sr-only">, home</span>
            </Link>
          </div>
        </header>
        <StorageBanner />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-xl flex-1 px-4 pt-6 pb-12 outline-none">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
