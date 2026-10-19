"use client";

// A labelled group of controls, e.g. person chips under "Who was there".
// data-invalid lets a form find and focus the first control in a group with an error.

import type { ReactNode } from "react";
import { describedBy, FieldError, FieldHint, labelClass, useFieldIds } from "./field";

type FieldGroupProps = {
  legend: ReactNode;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function FieldGroup({ legend, hint, error, children }: FieldGroupProps) {
  const { hintId, errorId } = useFieldIds();
  return (
    <fieldset aria-describedby={describedBy(hint && hintId, error && errorId)} data-invalid={error ? "" : undefined}>
      <legend className={labelClass}>{legend}</legend>
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <div className="mt-2">{children}</div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </fieldset>
  );
}
