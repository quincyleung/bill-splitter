"use client";

// The app's pop-up: a native modal <dialog> in the middle of the screen, the page behind
// dimmed and unreachable. Focus starts on the first control inside; Escape or a tap on
// the dimmed page closes it; a tall middle scrolls while the title and buttons stay put.
// It's placed at the end of <body>, so a pop-up opened from inside the bill form isn't
// part of that form (Enter inside it can't press Save).

import { type ReactNode, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Called once it has closed, however that happened. Move focus from here if needed. */
  onClose: () => void;
  /** The buttons along the bottom, given `close` for Cancel or Done. */
  actions: (close: () => void) => ReactNode;
  /** Stays above the scrolling part, e.g. a box to find someone. */
  top?: ReactNode;
  children?: ReactNode;
};

export function Dialog({ title, description, onClose, actions, top, children }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  // The element itself (not a ref), so the buttons can be given `close` while rendering.
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, [dialog]);

  // Close first: while a modal dialog is open, focus can't move outside it.
  function close() {
    dialog?.close();
    onClose();
  }

  if (typeof document === "undefined") return null;
  return createPortal(
    <dialog
      ref={setDialog}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault(); // Escape: close through the same path as the buttons
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close(); // a tap on the dimmed page
      }}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm flex-col rounded-card border border-line bg-surface p-0 text-ink backdrop:bg-ink/40 open:flex"
    >
      <div className="px-6 pt-6">
        <h2 id={titleId} className="type-title text-ink">
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className="mt-2 text-ink-muted">
            {description}
          </p>
        )}
        {top && <div className="mt-4">{top}</div>}
      </div>
      {/* relative: the visually hidden inputs of ticks inside are placed in here, so they
          scroll with the list instead of making the whole pop-up overflow. */}
      {children && <div className="relative min-h-0 flex-1 overflow-y-auto px-6 pt-4">{children}</div>}
      <div className="flex flex-wrap justify-end gap-2 px-6 pt-6 pb-6">{actions(close)}</div>
    </dialog>,
    document.body,
  );
}
