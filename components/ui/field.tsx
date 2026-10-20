"use client";

// Pieces shared by every form field: ids, hint and error. One column, label on
// top, hint under the label, error under the input saying what to do next.

import { type ReactNode, useId } from "react";
import { AlertIcon } from "./icons";

export function useFieldIds(id?: string) {
  const generated = useId();
  const fieldId = id ?? generated;
  return { fieldId, hintId: `${fieldId}-hint`, errorId: `${fieldId}-error` };
}

/** Joins the ids that are present, for aria-describedby. */
export function describedBy(...ids: (string | false | undefined)[]): string | undefined {
  return ids.filter(Boolean).join(" ") || undefined;
}

export function FieldHint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="type-small mt-1 text-ink-muted">
      {children}
    </p>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="type-small mt-2 flex items-start gap-2 font-semibold text-danger">
      <AlertIcon className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/** Greek Summer field labels: small uppercase, muted. */
export const labelClass = "type-label block text-ink-muted";

export function inputBorder(error?: string) {
  return error ? "border-danger" : "border-field";
}

/** The look of a plain text input, shared by TextField and AddField. */
export function inputClass(error?: string) {
  return `block min-h-11 w-full min-w-0 flex-1 rounded-field border bg-surface px-3 text-[1.0625rem] text-ink transition-colors placeholder:text-ink-faint hover:border-ink focus:border-ink ${inputBorder(error)}`;
}
