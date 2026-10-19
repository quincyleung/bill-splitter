import Link from "next/link";

const QUICK_STARTS = [
  { href: "/new/meal", title: "Dinner", detail: "Split by what each person had" },
  { href: "/new/even", title: "Uber", detail: "Split evenly" },
  { href: "/new/recurring", title: "Monthly bill", detail: "Split evenly, every month" },
];

/** The three ways to start a bill. Static, so they show before saved data has loaded. */
export function QuickStarts() {
  return (
    <ul className="space-y-3">
      {QUICK_STARTS.map((start) => (
        <li key={start.href}>
          <Link
            href={start.href}
            className="flex min-h-16 flex-col justify-center rounded-2xl bg-accent px-5 py-3 text-on-accent hover:bg-accent-hover"
          >
            <span className="text-lg font-bold">{start.title}</span>
            <span className="text-sm">{start.detail}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
