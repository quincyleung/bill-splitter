"use client";

// A full-width row you tick off, e.g. "Julie · $30.00" once she's paid you back.
// A real checkbox underneath; the square box (not the round person chips) and the
// "Paid" text show the state, so it doesn't rely on colour.

import type { ComponentProps } from "react";

type CheckRowProps = Omit<ComponentProps<"input">, "type" | "className" | "checked" | "onChange"> & {
  label: string;
  /** Short status under the label, e.g. "Owes you" or "Paid". */
  detail: string;
  /** Shown on the right, e.g. the amount. */
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckRow({ label, detail, value, checked, onChange, ...inputProps }: CheckRowProps) {
  return (
    <label className="focus-ring-within flex min-h-14 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 hover:bg-accent-soft">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        {...inputProps}
      />
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0">
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          className={checked ? "fill-accent stroke-accent" : "fill-surface stroke-field"}
          strokeWidth="2"
        />
        {checked && (
          <path
            d="M7 12.5l3.5 3.5 6.5-8"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-on-accent"
          />
        )}
      </svg>
      <span className="flex-1">
        <span className="block text-base font-semibold text-ink">{label}</span>
        <span className="block text-sm text-ink-muted">{detail}</span>
      </span>
      <span className={`text-base ${checked ? "text-ink-muted line-through" : "font-semibold text-ink"}`}>{value}</span>
    </label>
  );
}
