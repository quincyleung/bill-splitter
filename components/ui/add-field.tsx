"use client";

// A text input with its button on the right, e.g. a name and "Add person", used inside
// a FieldGroup so it reads as part of that question. The button's text is the input's
// visible label (aria-labelledby), the usual pattern for search-style fields. Enter
// presses the button instead of submitting the form.

import type { ComponentProps } from "react";
import { Button } from "./button";
import { describedBy, FieldError, inputClass } from "./field";

type AddFieldProps = Omit<
  ComponentProps<"input">,
  "className" | "id" | "aria-labelledby" | "aria-describedby" | "aria-invalid"
> & {
  id: string;
  buttonLabel: string;
  onAdd: () => void;
  error?: string;
};

export function AddField({ id, buttonLabel, onAdd, error, onKeyDown, ...inputProps }: AddFieldProps) {
  const buttonId = `${id}-button`;
  const errorId = `${id}-error`;
  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          id={id}
          aria-labelledby={buttonId}
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
