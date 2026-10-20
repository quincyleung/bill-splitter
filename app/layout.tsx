import type { Metadata } from "next";
import { Manrope, Marcellus } from "next/font/google";
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
    // suppressHydrationWarning: browser extensions (password managers, Grammarly, dark-mode
    // tools) add attributes to <html> and <body> before React loads. This ignores those
    // attribute differences on these two elements only; everything inside is still checked.
    <html lang="en" suppressHydrationWarning className={`${marcellus.variable} ${manrope.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-surface focus-visible:px-4 focus-visible:py-3 focus-visible:font-semibold"
        >
          Skip to main content
        </a>
        <StorageBanner />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-xl flex-1 px-4 pt-5 pb-12 outline-none">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
