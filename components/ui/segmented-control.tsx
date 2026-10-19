"use client";

// A row of options where exactly one is chosen, e.g. Repeats: Weekly / Every 2 weeks /
// Monthly / Custom. Built on real radio buttons, so arrow keys and screen readers work.
// Greek Summer chips: the chosen one gets the light blue "selected" fill, a navy edge and a tick.

import { describedBy, FieldError, FieldHint, labelClass, useFieldIds } from "./field";
import { CheckIcon } from "./icons";

type Option<T extends string> = { value: T; label: string };

type SegmentedControlProps<T extends string> = {
  legend: string;
  name: string;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  hint?: string;
  error?: string;
};

export function SegmentedControl<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  hint,
  error,
}: SegmentedControlProps<T>) {
  const { hintId, errorId } = useFieldIds();
  return (
    <fieldset aria-describedby={describedBy(hint && hintId, error && errorId)} data-invalid={error ? "" : undefined}>
      <legend className={labelClass}>{legend}</legend>
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="focus-ring-within press type-control inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-field bg-surface px-4 text-ink hover:bg-accent-soft has-[:checked]:border-selected-border has-[:checked]:bg-selected has-[:checked]:text-on-selected"
          >
            <input
              type="radio"
              className="sr-only"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {value === option.value && <CheckIcon className="size-4 shrink-0" />}
            {option.label}
          </label>
        ))}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </fieldset>
  );
}
