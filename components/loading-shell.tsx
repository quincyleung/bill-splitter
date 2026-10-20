/**
 * The loading screen: "Bill Splitter" in the centre, a short gold line (the Greek Summer
 * sun) and three soft Aegean-blue dots. It's in the server's HTML, so it's the first
 * thing shown while the app starts on any page, and it covers the page until saved
 * data has been read. No motion for people who ask for reduced motion.
 */
export function LoadingShell() {
  return (
    <div data-splash aria-busy="true" className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-canvas px-6">
      <p className="type-display splash-rise text-center text-ink">Bill Splitter</p>
      <span aria-hidden="true" className="splash-rise mt-4 block h-0.5 w-12 rounded-full bg-badge" />
      <span aria-hidden="true" className="splash-dots mt-8 flex gap-2">
        <span />
        <span />
        <span />
      </span>
      <p role="status" className="sr-only">
        Loading your bills…
      </p>
    </div>
  );
}
