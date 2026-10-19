# Process log

## Step 1: Project context (2026-10-18)

**Asked:** Project context only, no app code. Move anything useful from CLAUDE.md into AGENTS.md and delete CLAUDE.md. Write a short AGENTS.md covering who it's for, constraints, rules and workflow. Then stop.

**Made:**
- There was no CLAUDE.md, so there was nothing to move or delete.
- Added four sections to AGENTS.md: who it's for, constraints, rules and workflow. Kept the Next.js block at the top, because `next dev` writes it back if it's removed.
- Started this log.

**Pushed back:** Nothing yet.

## Step 2: Design the flows (2026-10-18)

**Asked:** Design the flows before any code. Three kinds of bill: group meals split by who ordered what, with tax and tip shared proportionally (the part I care most about); Uber rides split evenly; and monthly bills with roommates. Work out three flows: the first visit with nothing saved, the main task (add a bill → choose who and how to split → see who owes me → mark paid), and coming back next week or next month. For each, propose screens, routes, states (empty, partly filled, error, success) and errors. Flag what to cut. No code; I choose what to keep.

**Made:**
- A proposal (in plan mode) with routes, phone-sized wireframes, a state table for each flow, exact error wording, non-blocking warnings, a list of cuts and nine decisions, each with a recommendation.
- Things I raised that weren't in the brief: one "Total paid" field instead of separate tax and tip fields; leftover pennies go to me so friends are never overcharged; a loading state so returning users don't see a flash of the empty screen; an autosaved draft; "Copy amounts" so friends find out what they owe; a person page with "Mark all paid"; and the risk that iPhone Safari deletes saved data after 7 days without a visit.
- `flows.md`: the agreed version, which later steps build against.

**Kept:** All nine recommendations, approved as proposed. Currency is still open and needs choosing before the first form.

**Pushed back:** Nothing. The proposal was approved as is.

## Step 2, continued: Changes to the flows (2026-10-18)

**Asked:**
- Three modes: meal, even split (one time) and recurring.
- Let me owe people too, e.g. when my roommate pays the utilities.
- An easier way to enter meal items than typing, such as a photo of the receipt.
- For recurring, let me pick how often: weekly, every 2 weeks, monthly or custom.
- Use $ as the currency, with an option to switch.

**Made:**
- Rules for owing people: every bill has one payer (me or anyone on the bill), only debts between me and the payer are tracked, Home shows a net balance per person, and the person page has Settle up.
- Three ways to read receipts, compared: paste text copied with the phone's built-in text recognition (no package or API), an OCR package in the app, or an AI API. Recommended pasting.
- Tested the paste idea with a scratch script on a real receipt pasted from the phone. All 5 items and the $258.93 subtotal came out right. The test also changed the design: find items by their prices because the paste had no line breaks, read leading quantities, stop at Subtotal so suggested-tip lines aren't read as dishes, and offer the receipt total under Total paid without filling it in automatically.
- Recurring frequency, with next-due dates and the month-end rule.
- Currency per bill, defaulting to the last one used (first default $ USD), shown per currency with no conversion.
- Rewrote `flows.md` with all of the above.

**Pushed back:**
- I had cut "friends owing each other / more than one payer". You wanted to owe people too, so the payer can now be someone else (debts between two other people are still cut).
- I had made recurring bills monthly only. You wanted to choose the frequency.
- I had cut more than one currency. You wanted to be able to switch.
- I had items typed in only. You asked for a receipt photo, tried pasting the text from your phone (the first paste was the wrong clipboard), and chose pasting the receipt or typing the items.

## Step 3: Flow diagrams and README (2026-10-18)

**Asked:** Exit plan mode. Add Mermaid diagrams of the three agreed flows (first visit, main task, coming back) to `flows.md`, including error and empty states. Replace the README with a short paragraph on the tool and who it's for, the main-task sentence, and the diagrams embedded as code blocks. Commit.

**Made:**
- Plan mode was already off; it ended when the first flow proposal was approved.
- Three Mermaid flowcharts, one at the top of each flow in `flows.md`, showing the loading, empty, partly filled, error and success states and the decisions between them. Every state is named in its box ("Error:", "Empty:", "Success:"), so the outline colours (red, dashed, green) aren't the only signal.
- Replaced the create-next-app README with the tool's description, who it's for, the main-task sentence, the same three diagrams, and a link to `flows.md`.
- Couldn't render the diagrams locally, because that would mean adding a package. Kept to plain Mermaid syntax and checked that both files hold identical diagrams.

**Pushed back:** Nothing.

## Step 3, continued: Main-task diagram fixed (2026-10-19)

**Asked:** The diagrams render well. But in the main-task diagram, shouldn't the meal-by-item steps apply only to Meal by item mode, with Even split and Recurring both split evenly?

**Made:**
- Redrew the main-task diagram in both `flows.md` and `README.md` with one lane per mode, starting straight from the mode choice. Only the Meal by item lane has the paste/type, receipt and "who had each item" steps, ending in item shares plus proportional tax and tip. The Even split and Recurring lanes each end in "Split evenly". The three lanes then join for Save, errors, the bill page and marking paid.
- Moved each warning into its own lane: the receipt and tax-and-tip warnings under Meal by item, and "next one not due yet" under Recurring.
- Fixed the same mix-up in the Flow 2 States table, so Empty and Partly filled now describe each mode separately.
- Checked that both files still hold identical diagrams.

**Pushed back:** You caught that the first version sent every mode through one shared path and then asked "Meal by item?" again, which made the item steps look like they applied to every mode.

## Step 4: Research how other apps welcome someone new (2026-10-19)

**Asked:** Send three subagents in parallel to research how Splitwise, Tricount and Settle Up welcome someone new: the first screen, what they ask for before you can do anything (sign-up, a group, names), and how many steps until a first bill is split. Use public sources. Write `research.md` with a comparison table, 3–5 patterns worth using and 2–3 to avoid. Don't change the app.

**Made:**
- Three research agents ran in parallel, one per app. Each labelled every claim as official, user-reported or inferred, and flagged conflicting sources.
- `research.md`: a comparison table across 11 rows, our planned step count for comparison (about 5, against about 8–10 for the others), 5 patterns worth using and 3 to avoid (each with what it means for us), possible changes to `flows.md` that I didn't make, gaps and caveats, and sources.
- The app and `flows.md` are unchanged.

**Pushed back:** Nothing.

## Step 4, continued: Research changes added to the flows (2026-10-19)

**Asked:** You liked suggested changes 2–4 from the research and asked what change 1 ("a person you've just added is ticked automatically") meant. After my explanation you kept it too, and asked me to commit and push.

**Made:**
- Explained change 1 with a before/after of the "Who was there" chips. Typing a name and pressing Add both saves the person and ticks them for this bill. People saved from earlier bills stay unticked.
- Added all four changes to `flows.md`:
  - new people ticked automatically;
  - example hints under fields, and no sample bills;
  - a one-time Home Screen tip after the first save, which can be dismissed;
  - "Copy amounts" text that stands on its own.
- Updated the Flow 1 diagram in both `flows.md` and `README.md` (still identical), and the decisions table.
- Marked the suggestions in `research.md` as made.

**Pushed back:** You asked what change 1 meant before agreeing to it. Once it was explained, you kept all four.
