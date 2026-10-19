import Link from "next/link";

const QUICK_STARTS = [
  { href: "/new/one-time", title: "One-time", detail: "A meal, a ride, anything once", primary: true },
  { href: "/new/recurring", title: "Recurring", detail: "Repeats, like utilities", primary: false },
];

/**
 * The two ways to start a bill. Static, so they show before saved data has loaded.
 * One-time is the main action, so it alone gets the Aegean blue.
 */
export function QuickStarts() {
  return (
    <ul className="space-y-3">
      {QUICK_STARTS.map((start) => (
        <li key={start.href}>
          <Link
            href={start.href}
            className={`press flex min-h-16 flex-col justify-center rounded-card px-5 py-4 ${
              start.primary
                ? "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-pressed"
                : "border border-field bg-surface text-ink hover:bg-accent-soft active:bg-soft-pressed"
            }`}
          >
            <span className="type-title">{start.title}</span>
            <span className={`type-small ${start.primary ? "" : "text-ink-muted"}`}>{start.detail}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
