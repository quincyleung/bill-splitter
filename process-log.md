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

## Step 5: The foundation (2026-10-19)

**Asked:** Build the foundation, with no features yet:
- a localStorage module for people, groups, bills and recurring bills, with a versioned key, where empty or corrupted storage can't crash the app and data loads after mount to avoid hydration errors;
- shared components: Button (primary and secondary), TextField and MoneyField (label, hint and error), a segmented control, PersonChip, Card and Toast;
- shared navigation that shows which page you're on;
- placeholder pages for each route.

Then commit.

**Made:**
- **Data model** (`lib/model.ts`): types for people, groups, bills (meal, even and recurring kinds) and recurring series, following `flows.md`. Money is stored in the smallest unit, and "me" is a fixed id. Validators check everything read back from storage.
- **Storage** (`lib/storage.ts`): versioned key `bill-splitter/v1`, and the functions never throw.
  - Empty storage loads as empty data.
  - Broken or wrongly shaped data comes back as "unreadable", with the raw text kept for a later Download and never overwritten silently.
  - Blocked storage means the app runs in memory only.
  - A full storage reports "full".
- **Store** (`lib/store.ts`): `useAppData()` loads after mount using `useSyncExternalStore`. The server and the hydration render see "loading", and localStorage is only read in the browser afterwards. `updateData()` only changes what's on screen if the save worked. `resetData()` backs "Start fresh".
- **Money** (`lib/money.ts`): parse `12` / `12.5` / `$12.50` / `1,234.50` into cents (yen has no decimals), and format with a fixed locale so server and browser output match.
- **Components** (`components/ui/`):
  - Button
  - TextField and MoneyField: label, hint under the label, error under the input, all linked with `aria-describedby` and `aria-invalid`. MoneyField opens the decimal keypad and tells screen readers the currency name.
  - SegmentedControl (real radio buttons)
  - PersonChip (a real checkbox, with a check mark so the state isn't shown by colour alone)
  - Card
  - Toast: an always-present live region, a Dismiss button outside it, and a pause while hovered or focused.
- **Theme** (`app/globals.css`): colour tokens for light and dark mode, all checked against AA (text 4.5:1, field borders and focus rings 3:1), and one visible focus ring for every control.
- **Navigation:** a skip link, plus a header nav with Home, Meal, Even split and Recurring. The current page is filled and marked `aria-current="page"`. Bill and person pages mark Home as their section. Every page has its own `h1` and tab title.
- **Placeholders** for all seven routes, each saying what the screen will hold.
- **Checks:**
  - lint and a production build;
  - 21 scratch tests of storage, store and money in Node with a fake localStorage (corrupt data, blocked and full storage, round trip, start fresh, money parsing). These weren't committed, because there's no test runner and adding one means a package;
  - the rendered HTML of every route and of every component (on a temporary page, since deleted).

**Things I decided along the way:**
- **Loading after mount:** Next's lint rejects the usual "`setState` in `useEffect`" pattern, so I used `useSyncExternalStore`. It has the same effect: nothing is read from storage until the page is running in the browser.
- **The nav on bill and person pages:** with Cache Components on, `usePathname` can't run on the server for pages with an unknown id. The nav sits in a `Suspense` boundary, those pages first show it with nothing marked, and the browser fills in "Home" after loading.

**Open question:** `flows.md` cut groups, but you listed them, so the storage has a `groups` collection that nothing uses yet.

**Pushed back:** Nothing.

## Step 5, continued: Groups removed (2026-10-19)

**Asked:** What groups are, then remove them for now.

**Made:**
- Explained that groups in our storage were a named set of people, a shortcut for ticking everyone on a bill. That's narrower than Splitwise, Tricount and Settle Up, where a group holds the bills and balances and has to come first.
- Asked whether "remove but provide the option" meant optional groups now or removal now. You chose removal.
- Took groups out of `lib/model.ts`: the type, the stored list and its validation. Saved data that still has a `groups` list loads fine, because extra fields are ignored. Adding groups back later can treat a missing list as empty, so existing data won't need converting.
- In `flows.md`, the "Cut" entry now says to add groups only if people using the app ask for them.
- Reran the 21 storage, store and money tests, lint and the build. All pass.

**Pushed back:** I had added groups to storage because you listed them, although `flows.md` had cut them. You decided to remove them for now.

## Step 6: The first visit (2026-10-19)

**Asked:** Build the first visit, with nothing saved. Goal: someone splits a real bill in under a minute without setting anything up.
- Quick starts (Dinner, Uber, Monthly bill) that open the form with the right split method preselected.
- Names typed inline and saved automatically for next time.
- No tour, no empty screen, no sign-up.

**Made:**
- **Home:** "Split a bill", a one-line welcome on a first visit ("Pick one to start. Everything stays on this phone, and your friends don't need the app."), and three quick starts:
  - Dinner: split by what each person had;
  - Uber: split evenly;
  - Monthly bill: split evenly, every month.

  The quick starts are server-rendered, so they appear straight away. Once there are bills, a plain "Your bills" list replaces the welcome until the dashboard is built.
- **One bill form behind all three quick starts:**
  - Dinner preselects **By item**, Uber **Evenly**, and Monthly bill a recurring bill with **Monthly**.
  - Dinner and Uber share a "How to split" switch, so a dinner everyone shared can be switched to Evenly without losing anything typed.
  - Fields, in order: what was it, date, who was there, Add a person, who paid, how to split, items (price, optional name, who had it, Everyone), total paid or amount, repeats (Monthly bill only).
  - A live "Who owes you" summary shows each person's items plus tax and tip.
- **Names inline:**
  - Type a name and press Add or Enter. The person is ticked, the cursor stays for the next name, and screen readers hear "Sam added to this bill."
  - People are saved when the bill is saved, but only if they're still ticked, so a mistyped name that gets unticked isn't kept.
  - Next time they appear first in the list, unticked.
- **Validation:** every message from `flows.md`, shown next to its field after Save. Focus moves to the first problem, errors clear as fields are fixed, and nothing typed is cleared. New messages:
  - a name typed but not added: "Press Add to put Jo on this bill, or clear the name.";
  - the date;
  - an amount of 0;
  - a total that isn't a number.
- **Splitting:** done in cents and always adding up to the exact total, with leftover cents going to whoever paid. For dinners, tax and tip are shared in proportion to each person's items.
- **Bill page:** who owes what ("Sam and Jo owe you $44.64"), your share, or "You owe Sam $42.00" when someone else paid. Plus Copy amounts, which has a fallback for plain http on a phone, a "Saved" toast, and "This bill isn't on this phone" for unknown ids.
- **Other states:**
  - a banner when the browser won't save;
  - the unreadable-data notice (Download my data, or Start fresh after confirming) on Home, the forms and the bill page.
- **Shared components added:** ButtonLink, FieldGroup, PageTitle; radio-style PersonChip; an action slot on TextField (the Add button).
- **Nav** now reads Home, Dinner, Uber, Monthly bill, to match the quick starts.
- **`flows.md` and README diagrams** updated to match.

**Checks:**
- lint and a production build;
- 18 new scratch tests of the split and form logic, including the real hot pot receipt (each friend owes $48.73, I absorb 4 cents, total exactly $341.15). The 21 storage tests still pass;
- a throwaway end-to-end script driving headless Chrome at phone width over the DevTools protocol (no packages), 13 checks:
  - first visit;
  - Uber split saved in under a second of automated time;
  - names saved for next time;
  - Dinner by item with exact shares;
  - errors and focus on Monthly bill;
  - reload;
  - unknown bill;
  - corrupted storage;
  - and no console errors or hydration warnings;
- screenshots at phone size in light and dark mode.

**Left for later steps:** pasting a receipt, Mark paid, Edit and Delete, the meal breakdown on the bill page, the currency picker (USD for now), the autosaved draft, and the dashboard.

**On hold:** the "Add to Home Screen" tip. On iPhone a Home Screen web app gets its own storage, separate from Safari's, so bills saved before adding it wouldn't show up in the Home Screen app. That needs a decision first.

**Pushed back:** Nothing.
