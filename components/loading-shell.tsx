/** What a page shows until saved data has been read. Never the empty first-visit screen. */
export function LoadingShell() {
  return (
    <div className="min-h-40" aria-busy="true">
      <p className="sr-only">Loading your bills…</p>
    </div>
  );
}
