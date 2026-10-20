"use client";

import type { ComponentProps, ReactNode } from "react";
import { describedBy, FieldError, FieldHint, inputClass, labelClass, useFieldIds } from "./field";

export type TextFieldProps = Omit<ComponentProps<"input">, "className" | "aria-describedby" | "aria-invalid"> & {
  label: string;
  hint?: string;
  /** What to do next, e.g. "Name this bill, like Netflix." */
  error?: string;
  /** The label on the left of a short box, on one line: "Every [ 3 ]". For a number or two. */
  inline?: boolean;
  /** More on that same line after the box, e.g. Weeks or Months. Only with inline. */
  after?: ReactNode;
};

export function TextField({ label, hint, error, id, inline = false, after, ...inputProps }: TextFieldProps) {
  const { fieldId, hintId, errorId } = useFieldIds(id);
  const input = (
    <input
      type="text"
      id={fieldId}
      aria-describedby={describedBy(hint && hintId, error && errorId)}
      aria-invalid={error ? true : undefined}
      className={inputClass(error)}
      {...inputProps}
    />
  );

  if (inline) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={fieldId} className="type-row text-ink">
            {label}
          </label>
          <div className="w-12">{input}</div>
          {after}
        </div>
        {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
        {error && <FieldError id={errorId}>{error}</FieldError>}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
      </label>
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <div className="mt-2">{input}</div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
