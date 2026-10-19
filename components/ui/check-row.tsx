"use client";

// A full-width row you tick off, e.g. "Julie · $30.00" once she's paid you back.
// A real checkbox underneath, drawn as a Greek Summer checkbox (6px corners, navy when
// ticked); the box, the struck-through amount and the status text show the state.

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
    <label className="focus-ring-within press flex min-h-14 cursor-pointer items-center gap-3 rounded-field px-3 py-2 hover:bg-accent-soft">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        {...inputProps}
      />
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0">
        <rect
          x="0.75"
          y="0.75"
          width="18.5"
          height="18.5"
          rx="6"
          className={checked ? "fill-check stroke-check" : "fill-surface stroke-field"}
          strokeWidth="1.5"
        />
        {checked && (
          <path
            d="M5.5 10.5l3 3 6-6.5"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-on-check"
          />
        )}
      </svg>
      <span className="flex-1">
        <span className="block font-semibold text-ink">{label}</span>
        <span className="type-small block text-ink-muted">{detail}</span>
      </span>
      <span className={checked ? "text-ink-muted line-through" : "font-semibold text-ink"}>{value}</span>
    </label>
  );
}
