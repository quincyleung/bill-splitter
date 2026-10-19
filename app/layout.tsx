import type { Metadata } from "next";
import { Manrope, Marcellus } from "next/font/google";
import { Suspense } from "react";
import { HeaderBar, SiteHeader } from "@/components/site-header";
import { StorageBanner } from "@/components/storage-banner";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

// Greek Summer type: Marcellus (carved Roman capitals) for headings, Manrope for everything else.
const marcellus = Marcellus({ weight: "400", subsets: ["latin"], variable: "--nf-marcellus" });
const manrope = Manrope({ subsets: ["latin"], variable: "--nf-manrope" });

export const metadata: Metadata = {
  title: { template: "%s · Bill Splitter", default: "Bill Splitter" },
  description: "Split meals, rides and recurring bills with friends, roommates and your partner. Saved on your phone only.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${marcellus.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-3 focus:font-semibold"
        >
          Skip to main content
        </a>
        <Suspense fallback={<HeaderBar />}>
          <SiteHeader />
        </Suspense>
        <StorageBanner />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-xl flex-1 px-4 pt-4 pb-12 outline-none">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
