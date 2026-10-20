"use client";

import type { ComponentProps } from "react";
import { describedBy, FieldError, FieldHint, inputBorder, labelClass, useFieldIds } from "./field";

type TextAreaProps = Omit<ComponentProps<"textarea">, "className" | "aria-describedby" | "aria-invalid"> & {
  label: string;
  hint?: string;
  error?: string;
};

/** A multi-line field with the same label, hint and error as TextField. */
export function TextArea({ label, hint, error, id, rows = 6, ...props }: TextAreaProps) {
  const { fieldId, hintId, errorId } = useFieldIds(id);
  return (
    <div>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
      </label>
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <textarea
        id={fieldId}
        rows={rows}
        aria-describedby={describedBy(hint && hintId, error && errorId)}
        aria-invalid={error ? true : undefined}
        className={`type-small mt-2 block w-full rounded-field border bg-surface px-3 py-2 text-ink transition-colors placeholder:text-ink-muted hover:border-ink focus:border-ink ${inputBorder(error)}`}
        {...props}
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
