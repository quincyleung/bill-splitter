"use client";

// A pop-up list to tick, with a box to find someone by name: Show all under Who was
// there, "Who had it" on a big bill, and Show groups (recent events, each with who was
// there on a second line, and no find box). Ticks apply straight away, so there's
// nothing to cancel; Done, Escape or a tap outside closes it.

import { useState } from "react";
import { nameMatches } from "@/lib/people";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Dialog } from "./dialog";
import { TextField } from "./text-field";

/** detail is a second, smaller line, e.g. "Oct 12 · Huddy and Chloe". */
type Option = { id: string; label: string; detail?: string };

type ChecklistDialogProps = {
  title: string;
  /** In the order to list them, e.g. Me, then A to Z. */
  options: Option[];
  selected: string[];
  onToggle: (id: string, checked: boolean) => void;
  /** Under the title. Defaults to how many are ticked: "5 of 21 ticked"; null for none. */
  description?: string | null;
  /** Whether there's a Find a person box (not for a short list like groups). */
  findable?: boolean;
  /** A first row that ticks or unticks everyone, e.g. "Everyone". */
  allLabel?: string;
  onAll?: (checked: boolean) => void;
  onClose: () => void;
};

export function ChecklistDialog({
  title,
  options,
  selected,
  onToggle,
  description,
  findable = true,
  allLabel,
  onAll,
  onClose,
}: ChecklistDialogProps) {
  const [query, setQuery] = useState("");
  const finding = query.trim() !== "";
  const shown = finding ? options.filter((option) => nameMatches(option.label, query)) : options;
  const ticked = options.filter((option) => selected.includes(option.id)).length;
  // Two-line rows (groups) get a little space, so a focus ring never touches the next row.
  const twoLines = options.some((option) => option.detail);

  return (
    <Dialog
      title={title}
      description={description === undefined ? `${ticked} of ${options.length} ticked` : description}
      onClose={onClose}
      top={
        findable ? (
          <TextField
            label="Find a person"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="search"
          />
        ) : undefined
      }
      actions={(close) => <Button onClick={close}>Done</Button>}
    >
      <ul className={twoLines ? "space-y-2" : undefined}>
        {allLabel && onAll && !finding && (
          <li>
            <Checkbox label={allLabel} checked={ticked === options.length} onChange={onAll} />
          </li>
        )}
        {shown.map((option) => (
          <li key={option.id}>
            <Checkbox
              label={
                option.detail ? (
                  <>
                    <span className="block">{option.label}</span>
                    <span className="type-small block font-normal text-ink-muted">{option.detail}</span>
                  </>
                ) : (
                  option.label
                )
              }
              checked={selected.includes(option.id)}
              onChange={(checked) => onToggle(option.id, checked)}
            />
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="text-ink-muted">No one called “{query.trim()}”.</p>}
    </Dialog>
  );
}
