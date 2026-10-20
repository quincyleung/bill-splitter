"use client";

// "More options" (⋯): a small menu on the right of a bill's name or an item's title,
// holding the action that removes it (Delete bill, Delete item), in red. A disclosure:
// Enter or a tap opens it with focus on the action; Escape closes it (focus back on ⋯),
// as do tapping outside and focus leaving it.

import { type RefObject, useEffect, useId, useRef, useState } from "react";
import { MoreIcon } from "./icons";

type MoreMenuProps = {
  /** Read after "More options for", e.g. "Dinner at Aba" or "item 2". */
  title: string;
  /** e.g. "Delete bill" or "Delete item". */
  deleteLabel: string;
  onDelete: () => void;
  /** The ⋯ button, when focus needs to come back to it later (e.g. after a pop-up's Cancel). */
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

export function MoreMenu({ title, deleteLabel, onDelete, triggerRef }: MoreMenuProps) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ownRef = useRef<HTMLButtonElement>(null);
  const buttonRef = triggerRef ?? ownRef;
  const firstItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstItemRef.current?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, buttonRef]);

  return (
    <div
      ref={wrapRef}
      className="relative shrink-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
        className="press inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-accent-soft"
      >
        <MoreIcon />
        <span className="sr-only">More options for {title}</span>
      </button>
      <div
        id={menuId}
        hidden={!open}
        className="absolute top-full right-0 z-10 mt-1 w-48 overflow-hidden rounded-field border border-field bg-surface"
      >
        <button
          ref={firstItemRef}
          type="button"
          onClick={() => {
            setOpen(false);
            onDelete();
          }}
          className="type-control flex min-h-11 w-full items-center px-4 text-left text-danger hover:bg-accent-soft"
        >
          {deleteLabel}
        </button>
      </div>
    </div>
  );
}
