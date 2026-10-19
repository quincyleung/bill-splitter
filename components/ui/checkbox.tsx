"use client";

// A Greek Summer checkbox with its label, e.g. "Mark paid". A real checkbox underneath,
// so it's announced as "Mark paid, checkbox, checked"; the box shows a tick when checked.

import type { ComponentProps, ReactNode } from "react";
import { CheckboxIcon } from "./icons";

type CheckboxProps = Omit<ComponentProps<"input">, "type" | "className" | "checked" | "onChange"> & {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Checkbox({ label, checked, onChange, ...inputProps }: CheckboxProps) {
  return (
    <label className="focus-ring-within press inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-field pr-2 text-ink">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        {...inputProps}
      />
      <CheckboxIcon checked={checked} />
      <span className="type-control">{label}</span>
    </label>
  );
}
