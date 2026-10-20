"use client";

// "More options" (⋯): a small menu on the right of a bill's name, holding the action
// that removes it (Delete bill), in red. A disclosure:
// Enter or a tap opens it with focus on the action; Escape closes it (focus back on ⋯),
// as do tapping outside and focus leaving it.

import { type RefObject, useEffect, useId, useRef, useState } from "react";
import { IconButton } from "./icon-button";
import { MoreIcon } from "./icons";

type MoreMenuProps = {
  /** Read after "More options for", e.g. "Dinner at Aba". */
  title: string;
  /** e.g. "Delete bill". */
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
      <IconButton
        ref={buttonRef}
        label={`More options for ${title}`}
        icon={<MoreIcon />}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      />
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
