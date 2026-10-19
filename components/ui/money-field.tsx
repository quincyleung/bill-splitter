"use client";

import { currencyName, currencySymbol } from "@/lib/money";
import { describedBy, FieldError, FieldHint, inputBorder, labelClass, useFieldIds } from "./field";
import type { TextFieldProps } from "./text-field";

type MoneyFieldProps = Omit<TextFieldProps, "type" | "inputMode"> & {
  /** ISO 4217 code, e.g. "USD". Shown as a symbol before the amount. */
  currency: string;
};

/**
 * A text input (not type="number", which rejects "$12.50") that opens the
 * decimal keypad. Its value stays exactly as typed; read it with parseMoney.
 */
export function MoneyField({ label, hint, error, id, currency, ...inputProps }: MoneyFieldProps) {
  const { fieldId, hintId, errorId } = useFieldIds(id);
  const currencyId = `${fieldId}-currency`;
  return (
    <div>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
      </label>
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <div
        className={`focus-ring-within mt-2 flex min-h-11 items-center rounded-lg border-2 bg-surface ${inputBorder(error)}`}
      >
        <span aria-hidden="true" className="pl-3 text-base text-ink-muted">
          {currencySymbol(currency)}
        </span>
        <span id={currencyId} className="sr-only">
          {currencyName(currency)}
        </span>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          id={fieldId}
          aria-describedby={describedBy(currencyId, hint && hintId, error && errorId)}
          aria-invalid={error ? true : undefined}
          className="min-h-11 w-full rounded-lg bg-transparent px-2 text-base text-ink focus-visible:outline-none"
          {...inputProps}
        />
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
