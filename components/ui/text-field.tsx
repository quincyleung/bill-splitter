"use client";

import type { ComponentProps, ReactNode } from "react";
import { describedBy, FieldError, FieldHint, inputBorder, labelClass, useFieldIds } from "./field";

export type TextFieldProps = Omit<ComponentProps<"input">, "className" | "aria-describedby" | "aria-invalid"> & {
  label: string;
  hint?: string;
  /** What to do next, e.g. "Name this bill, like Electricity." */
  error?: string;
  /** A button beside the input, e.g. Add in "Add a person". */
  action?: ReactNode;
};

export function TextField({ label, hint, error, id, action, ...inputProps }: TextFieldProps) {
  const { fieldId, hintId, errorId } = useFieldIds(id);
  return (
    <div>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
      </label>
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          id={fieldId}
          aria-describedby={describedBy(hint && hintId, error && errorId)}
          aria-invalid={error ? true : undefined}
          className={`block min-h-11 w-full min-w-0 flex-1 rounded-lg border-2 bg-surface px-3 text-base text-ink ${inputBorder(error)}`}
          {...inputProps}
        />
        {action}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
