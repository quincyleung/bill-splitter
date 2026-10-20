"use client";

// A pop-up list of people to tick, with a box to find someone by name: "Show all 20
// people" under Who was there, and "Who had it" on a big bill. Ticks apply straight
// away, so there's nothing to cancel; Done, Escape or a tap outside closes it.

import { useState } from "react";
import { nameMatches } from "@/lib/people";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Dialog } from "./dialog";
import { TextField } from "./text-field";

type Option = { id: string; label: string };

type ChecklistDialogProps = {
  title: string;
  /** In the order to list them, e.g. Me, then A to Z. */
  options: Option[];
  selected: string[];
  onToggle: (id: string, checked: boolean) => void;
  /** A first row that ticks or unticks everyone, e.g. "Everyone". */
  allLabel?: string;
  onAll?: (checked: boolean) => void;
  onClose: () => void;
};

export function ChecklistDialog({ title, options, selected, onToggle, allLabel, onAll, onClose }: ChecklistDialogProps) {
  const [query, setQuery] = useState("");
  const finding = query.trim() !== "";
  const shown = finding ? options.filter((option) => nameMatches(option.label, query)) : options;
  const ticked = options.filter((option) => selected.includes(option.id)).length;

  return (
    <Dialog
      title={title}
      description={`${ticked} of ${options.length} ticked`}
      onClose={onClose}
      top={
        <TextField
          label="Find a person"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="search"
        />
      }
      actions={(close) => <Button onClick={close}>Done</Button>}
    >
      <ul>
        {allLabel && onAll && !finding && (
          <li>
            <Checkbox label={allLabel} checked={ticked === options.length} onChange={onAll} />
          </li>
        )}
        {shown.map((option) => (
          <li key={option.id}>
            <Checkbox
              label={option.label}
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
