"use client";

import type { ComponentProps } from "react";
import { describedBy, FieldError, FieldHint, inputClass, labelClass, useFieldIds } from "./field";

export type TextFieldProps = Omit<ComponentProps<"input">, "className" | "aria-describedby" | "aria-invalid"> & {
  label: string;
  hint?: string;
  /** What to do next, e.g. "Name this bill, like Electricity." */
  error?: string;
};

export function TextField({ label, hint, error, id, ...inputProps }: TextFieldProps) {
  const { fieldId, hintId, errorId } = useFieldIds(id);
  return (
    <div>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
      </label>
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <div className="mt-2">
        <input
          type="text"
          id={fieldId}
          aria-describedby={describedBy(hint && hintId, error && errorId)}
          aria-invalid={error ? true : undefined}
          className={inputClass(error)}
          {...inputProps}
        />
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
