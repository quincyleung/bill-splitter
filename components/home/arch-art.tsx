/**
 * Greek Summer's arches: whitewashed arches with Aegean blue doors under a gold sun,
 * on the style's light blue. Decorative only (hidden from screen readers).
 */
export function ArchArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 360 96"
      preserveAspectRatio="xMidYMax slice"
      className="h-24 w-full rounded-card bg-selected"
    >
      <circle cx="306" cy="34" r="15" className="fill-badge" />
      {[10, 140].map((dx) => (
        <g key={dx} transform={`translate(${dx} -4)`}>
          <path d="M52 100V54a28 28 0 0 1 56 0v46z" className="fill-canvas" />
          <path d="M68 100V62a12 12 0 0 1 24 0v38z" className="fill-accent" />
        </g>
      ))}
    </svg>
  );
}
