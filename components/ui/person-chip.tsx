"use client";

// One person in "Who was there", "Who had it" or "Who paid" (or a group of them: "Same 5
// people as Ski trip"). A real checkbox
// underneath, so it's announced as "Sam, checkbox, checked": ticked shows a check mark
// as well as the light blue fill and navy edge, so the state doesn't rely on colour.
// type="radio" is for pick-one questions like "Who paid": it shows a Greek Summer radio
// (a navy dot) and no fill, so it doesn't look like the tick-many chips. Put chips in a FieldGroup.

import type { ComponentProps } from "react";
import { CheckIcon, RadioIcon } from "./icons";

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
      className={`focus-ring-within press type-control inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-field bg-surface px-4 text-ink hover:bg-accent-soft has-[:checked]:border-selected-border ${
        type === "radio" ? "" : "has-[:checked]:bg-selected has-[:checked]:text-on-selected"
      }`}
    >
      <input
        type={type}
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        {...inputProps}
      />
      {type === "radio" ? <RadioIcon checked={checked} /> : checked && <CheckIcon className="size-4" />}
      {label}
    </label>
  );
}
