"use client";

// A text input with its button on the right, e.g. a name and "Add person", used inside
// a FieldGroup so it reads as part of that question. It has a real <label> (visually
// hidden, since the box's placeholder and the button beside it say what it's for).
// Enter presses the button instead of submitting the form.
//
// With `suggestions` it's also a combobox: matches show in a list under the box, the
// first one highlighted. Enter (or the button) picks the highlighted one, the arrow keys
// move the highlight, Escape hides the list, and a tap picks any of them.

import { type ComponentProps, useState } from "react";
import { Button } from "./button";
import { describedBy, FieldError, inputClass } from "./field";

type Suggestion = { id: string; label: string };

type AddFieldProps = Omit<
  ComponentProps<"input">,
  "className" | "id" | "aria-labelledby" | "aria-describedby" | "aria-invalid" | "role"
> & {
  id: string;
  /** The field's real label, read by screen readers, e.g. "Find or add a person". */
  label: string;
  buttonLabel: string;
  onAdd: () => void;
  error?: string;
  /** Matches for what's typed. While there are any, Enter and the button pick one. */
  suggestions?: Suggestion[];
  onPick?: (id: string) => void;
};

export function AddField({
  id,
  label,
  buttonLabel,
  onAdd,
  error,
  suggestions = [],
  onPick,
  onKeyDown,
  onChange,
  ...inputProps
}: AddFieldProps) {
  const buttonId = `${id}-button`;
  const errorId = `${id}-error`;
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const [active, setActive] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // A different list of matches starts again on its first one.
  const listKey = suggestions.map((s) => s.id).join(",");
  const [seenKey, setSeenKey] = useState(listKey);
  if (listKey !== seenKey) {
    setSeenKey(listKey);
    setActive(0);
    setDismissed(false);
  }
  const open = Boolean(onPick) && suggestions.length > 0 && !dismissed;
  const highlighted = Math.min(active, suggestions.length - 1);

  function add() {
    if (open) onPick?.(suggestions[highlighted].id);
    else onAdd();
  }

  function move(step: number) {
    if (!onPick || suggestions.length === 0) return;
    setActive(open ? (highlighted + step + suggestions.length) % suggestions.length : 0);
    setDismissed(false);
  }

  return (
    <div>
      <label id={labelId} htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          id={id}
          role={onPick ? "combobox" : undefined}
          aria-autocomplete={onPick ? "list" : undefined}
          aria-expanded={onPick ? open : undefined}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open ? optionId(highlighted) : undefined}
          aria-describedby={describedBy(error && errorId)}
          aria-invalid={error ? true : undefined}
          className={inputClass(error)}
          onChange={(event) => {
            setDismissed(false);
            onChange?.(event);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              move(event.key === "ArrowDown" ? 1 : -1);
            } else if (event.key === "Escape" && open) {
              event.preventDefault();
              setDismissed(true);
            }
          }}
          {...inputProps}
        />
        <Button id={buttonId} variant="secondary" onClick={add}>
          {buttonLabel}
        </Button>
      </div>
      {open && (
        <ul id={listId} role="listbox" aria-labelledby={labelId} className="mt-2 rounded-field border border-field bg-surface py-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={optionId(index)}
              role="option"
              aria-selected={index === highlighted}
              // Keep focus (and the phone's keyboard) in the box.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onPick?.(suggestion.id)}
              className={`type-row flex min-h-11 cursor-pointer items-center px-3 text-ink hover:bg-accent-soft ${
                index === highlighted ? "bg-accent-soft outline-2 -outline-offset-2 outline-focus" : ""
              }`}
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
