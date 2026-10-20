// Small decorative icons. Always aria-hidden: the text next to them carries the meaning.

type IconProps = { className?: string };

export function CheckIcon({ className = "size-5" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A radio button: an empty ring, or a navy disc with a white dot when chosen. */
export function RadioIcon({ checked, className = "size-5 shrink-0" }: IconProps & { checked: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className}>
      {checked ? (
        <>
          <circle cx="10" cy="10" r="9" className="fill-check" />
          <circle cx="10" cy="10" r="3.5" className="fill-on-check" />
        </>
      ) : (
        <circle cx="10" cy="10" r="8.25" fill="none" strokeWidth="1.5" className="stroke-field" />
      )}
    </svg>
  );
}

/** A Greek Summer checkbox: 6px corners, navy with a white tick when checked. */
export function CheckboxIcon({ checked, className = "size-5 shrink-0" }: IconProps & { checked: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className}>
      <rect
        x="0.75"
        y="0.75"
        width="18.5"
        height="18.5"
        rx="6"
        strokeWidth="1.5"
        className={checked ? "fill-check stroke-check" : "fill-surface stroke-field"}
      />
      {checked && (
        <path
          d="M5.5 10.5l3 3 6-6.5"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-on-check"
        />
      )}
    </svg>
  );
}

/** A down arrow (chevron), for opening and minimizing. Rotate it to point right when minimized. */
export function ChevronIcon({ className = "size-5" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Three dots, for a "more options" button. */
export function MoreIcon({ className = "size-6" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

/** A trash can, for deleting an item. */
export function TrashIcon({ className = "size-6" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 12a2 2 0 002 2h7a2 2 0 002-2l1-12M9 7V4.5a1 1 0 011-1h4a1 1 0 011 1V7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AlertIcon({ className = "size-5" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.5a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zM10 14.75a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
