"use client";

// A labelled group of controls, e.g. person chips under "Who was there".
// data-invalid lets a form find and focus the first control in a group with an error.
// size="title" is for a group that's a card of its own, like "Item 2": its legend is a
// title (Lead, 20px), clearly above the small uppercase labels of the fields inside.

import type { ReactNode } from "react";
import { describedBy, FieldError, FieldHint, labelClass, useFieldIds } from "./field";

type FieldGroupProps = {
  legend: ReactNode;
  hint?: string;
  error?: string;
  size?: "label" | "title";
  children: ReactNode;
};

export function FieldGroup({ legend, hint, error, size = "label", children }: FieldGroupProps) {
  const { hintId, errorId } = useFieldIds();
  return (
    <fieldset aria-describedby={describedBy(hint && hintId, error && errorId)} data-invalid={error ? "" : undefined}>
      <legend className={size === "title" ? "type-lead text-ink" : labelClass}>{legend}</legend>
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <div className={size === "title" ? "mt-4" : "mt-2"}>{children}</div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </fieldset>
  );
}
