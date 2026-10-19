"use client";

// One person in "Who was there" or "Who had it". A real checkbox underneath, so it's
// announced as "Sam, checkbox, checked". Ticked shows a check mark as well as the fill,
// so the state doesn't rely on colour. Put chips in a <fieldset> with a <legend>.

import type { ComponentProps } from "react";
import { CheckIcon, CircleIcon } from "./icons";

type PersonChipProps = Omit<ComponentProps<"input">, "type" | "className" | "checked" | "onChange"> & {
  /** The person's name as shown, e.g. "Me" or "Sam". */
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function PersonChip({ label, checked, onChange, ...inputProps }: PersonChipProps) {
  return (
    <label className="focus-ring-within inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-field bg-surface px-4 text-base font-semibold text-ink hover:bg-accent-soft has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-on-accent">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        {...inputProps}
      />
      {checked ? <CheckIcon /> : <CircleIcon />}
      {label}
    </label>
  );
}
