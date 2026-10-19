"use client";

// One person in "Who was there", "Who had it" or "Who paid". A real checkbox
// underneath, so it's announced as "Sam, checkbox, checked": ticked shows a check mark
// as well as the fill, so the state doesn't rely on colour. type="radio" is for
// pick-one questions like "Who paid": it shows a radio dot and a light fill instead,
// so it doesn't look like the tick-many chips. Put chips in a FieldGroup.

import type { ComponentProps } from "react";
import { CheckIcon, CircleIcon, RadioIcon } from "./icons";

type PersonChipProps = Omit<ComponentProps<"input">, "type" | "className" | "checked" | "onChange"> & {
  /** The person's name as shown, e.g. "Me" or "Sam". */
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  type?: "checkbox" | "radio";
};

export function PersonChip({ label, checked, onChange, type = "checkbox", ...inputProps }: PersonChipProps) {
  return (
    <label
      className={`focus-ring-within inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-field bg-surface px-4 text-base font-semibold text-ink hover:bg-accent-soft has-[:checked]:border-accent ${
        type === "radio" ? "has-[:checked]:bg-accent-soft" : "has-[:checked]:bg-accent has-[:checked]:text-on-accent"
      }`}
    >
      <input
        type={type}
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        {...inputProps}
      />
      {type === "radio" ? (
        <RadioIcon checked={checked} className={`size-5 ${checked ? "text-accent" : ""}`} />
      ) : checked ? (
        <CheckIcon />
      ) : (
        <CircleIcon />
      )}
      {label}
    </label>
  );
}
