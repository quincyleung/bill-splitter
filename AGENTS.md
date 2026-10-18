<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Bill Splitter

A bill splitter I'd actually use with friends, roommates and my partner: group meals, recurring bills like utilities, and Uber rides.

## Who it's for

Me. I'm usually the one who paid, and I split on my phone right after paying. Design for a phone screen first, and make a split quick to finish.

## Constraints

- Next.js App Router + Tailwind CSS.
- Data lives in `localStorage` only. No database, accounts, API routes or external APIs.
- Ask before adding any package.

## Rules

- Shared components (`Button`, fields with label and error, etc.) are used everywhere. No one-off buttons or inputs.
- Forms are one column.
- Errors sit next to their field and say what to do next ("Enter an amount above $0"), not only what went wrong. Link them with `aria-describedby` and set `aria-invalid`.
- Never clear what was typed, including after an error.
- Everything is keyboard-accessible, with visible focus and nothing that needs a mouse.
- Every input has a real `<label>`. Placeholders don't count as labels.
- Text and controls meet WCAG AA contrast.

## Workflow

- One step at a time, and only the step I ask for. Don't build ahead.
- Commit after each step with a clear message.
- After each step, append to `process-log.md`: what I asked, what you made, and where I pushed back.
