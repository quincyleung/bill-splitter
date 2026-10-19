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
