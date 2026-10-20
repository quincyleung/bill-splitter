"use client";

// A text input with its button on the right, e.g. a name and "Add person", used inside
// a FieldGroup so it reads as part of that question. It has a real <label> (visually
// hidden, since the box's placeholder and the button beside it say what it's for).
// Enter presses the button instead of submitting the form.

import type { ComponentProps } from "react";
import { Button } from "./button";
import { describedBy, FieldError, inputClass } from "./field";

type AddFieldProps = Omit<
  ComponentProps<"input">,
  "className" | "id" | "aria-labelledby" | "aria-describedby" | "aria-invalid"
> & {
  id: string;
  /** The field's real label, read by screen readers, e.g. "Name of someone to add". */
  label: string;
  buttonLabel: string;
  onAdd: () => void;
  error?: string;
};

export function AddField({ id, label, buttonLabel, onAdd, error, onKeyDown, ...inputProps }: AddFieldProps) {
  const buttonId = `${id}-button`;
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          id={id}
          aria-describedby={describedBy(error && errorId)}
          aria-invalid={error ? true : undefined}
          className={inputClass(error)}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
          {...inputProps}
        />
        <Button id={buttonId} variant="secondary" onClick={onAdd}>
          {buttonLabel}
        </Button>
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
