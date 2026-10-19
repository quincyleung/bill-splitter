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

## Step 6, continued: No tabs, clearer names (2026-10-19)

**Asked:** Remove the Home / Dinner / Uber / Monthly bill tabs at the top, because they're redundant. Use better names for the options, like Meal, Even Split and Recurring.

**Made:**
- **Tabs removed** (the nav component is deleted). The header now holds only the app name, which links back to Home; screen readers hear "Bill Splitter, home". Each page's title still says where you are, and Home's quick starts are how a bill starts. This replaces the "shared navigation that shows which page you're on" from Step 5.
- **Renamed the options everywhere:** quick starts, page titles, tab titles, and the presets in code (now `meal`, `even`, `recurring`, matching the routes).
  - Meal: "Split by what each person had"
  - Even split: "Split evenly, like an Uber ride"
  - Recurring: "Split evenly and repeats, like utilities"

  I used sentence case ("Even split") to match the rest of the app. A blank "What was it?" is now saved as "Meal" or "Even split" instead of "Dinner" or "Uber ride".
- **Docs:** updated `flows.md` (decisions, routes, a new navigation rule, wireframes, headings) and the diagrams in both `flows.md` and `README.md`, which still match.
- **Checks:** lint, build, the logic and storage tests, the 13 headless Chrome end-to-end checks (now also checking the header has no tabs and links Home), and new screenshots.

**Pushed back:**
- The tabs I added in Step 5 duplicated the quick starts.
- The quick start names Dinner / Uber / Monthly bill were too narrow, so they're now Meal / Even split / Recurring.

## Step 6, continued: Form wording and layout (2026-10-19)

**Asked:**
- On the Meal form, make the first question a name, like "Dinner at Aba".
- Make Add person a button on the right so it looks like part of "Who was there".
- Put each item's name before its price.
- Use labels without question marks.
- Push the earlier commits.

**Made:**
- Pushed `7efceec` and `3eb6253` to GitHub.
- **Name first:** Meal and Even split now open with "Name (optional)", hinted "Like Dinner at Aba" for Meal and "Like Uber to the airport" for Even split. Recurring keeps the required "Name". Even split changed too, because "What was it" doesn't read well without its question mark.
- **Add person** is now part of "Who was there":
  - A new shared AddField puts the name input and an **Add person** button on its right in one row, under the chips, with no separate bold label.
  - "New names are saved for next time." moved up as the group's hint.
  - The button's text labels the input for screen readers (aria-labelledby, the standard pattern for search-style fields). Enter still adds.
  - TextField's action slot is gone, since nothing uses it now.
- **Items:** Name (optional), then Price, then Who had it. Add item now puts the cursor in the new item's name.
- **No question marks:** "Who paid", "Who's splitting it", and "Repeat every" (was "Every how many?"). Messages now say "press Add person". `flows.md` has a new labels rule.
- **Docs:** updated `flows.md` (rules, the Meal wireframe, the item order, the errors table) and the Flow 1 diagram in both files.
- **Checks:** lint, build, the logic and storage tests, and the end-to-end checks in headless Chrome, which now also check that:
  - Add person is to the right of the input in the same row and inside "Who was there";
  - it labels the input;
  - Name is the first question;
  - item name comes before price;
  - no label ends in "?".

  I also took a screenshot of the Meal form.

**Pushed back:**
- Meal should start with a name.
- "Add a person" looked like a separate question.
- Items should ask for a name before the price.
- Labels shouldn't use question marks.

## Step 6, continued: Required names, One-time / Recurring, a clearer Who paid (2026-10-19)

**Asked:**
- Make the name required, for the bill and for each item, because "(optional)" looks cluttered.
- "Who paid" only lets me pick one person.
- Would Home be better as just One-time and Recurring, since the form already lets you choose By item or Evenly?

**Made:**
- **Asked two questions before building:**
  - Who paid: one payer is by design (`flows.md` cut "one bill paid by two people"), but the chips looked like the tick-many ones. You chose to keep one payer with a clearer control.
  - Home: you chose One-time and Recurring, with One-time starting on Evenly.
- **Names required:**
  - "Name" is the first question on both forms, with no "(optional)" anywhere. Errors: "Name this bill, like Dinner at Aba." (or "like Electricity.").
  - Each item asks for Name, then Price, then Who had it. Error: "Name this item, like Burger." Save moves focus to the first unnamed item.
  - The blank-name fallbacks are gone.
- **Home:**
  - Two quick starts: **One-time** ("A meal, a ride, anything once") and **Recurring** ("Repeats, like utilities").
  - `/new/one-time` ("One-time bill") replaces `/new/meal` and `/new/even`.
  - The form opens on How to split: **Evenly**, with **By item** one tap away. Recurring is titled "Recurring bill".
- **Who paid:** PersonChip has a radio style. It shows a ring with a dot and a light fill, so "Who paid" no longer looks like the solid tick chips under "Who was there".
- **Docs:** updated `flows.md` (decisions, routes, rules, wireframes, headings, errors) and redrew the main-task diagram, where One-time now branches on How to split, in both `flows.md` and `README.md`.
- **Checks:** lint, build, the rewritten logic tests, the storage tests, and 14 end-to-end checks in headless Chrome. The new ones cover:
  - Name first and required;
  - item names required, with focus moving to the unnamed item;
  - the payer is a radio that looks different;
  - the two quick starts.

**Pushed back:**
- Optional names looked cluttered.
- The single-payer control looked like a multi-select.
- Meal and Even split were really the same form, so Home is now One-time and Recurring.

## Step 7: Tick off who's paid you back (2026-10-19)

**Asked:** Let me check off who's paid me back. For example, after dinner with Josh and Julie, tick each of them off separately when they pay.

**Made:**
- **Bill page:**
  - Each person who owes you has a tick box row with their name, "Owes you" or "Paid you back", and their amount, which is struck through once paid. It's a new shared CheckRow: a real checkbox with a square box, so it doesn't look like the round person chips.
  - Untick to undo.
  - The heading names only who still owes ("Josh owes you $30.00") with "1 of 2 paid" under it. Once the last person is ticked it becomes "All paid up", with the toast "Everyone's paid you back."
  - On a bill someone else paid, the one tick box is "I paid Sam back".
  - If saving fails, the tick stays as it was, with "Couldn't save that. Try again."
- **Copy amounts** lists only people who haven't paid yet, and disappears when nobody owes.
- **Home's "Your bills"** shows each bill's status: "1 of 2 paid", "All paid up", "Not paid back yet" or "Paid back".
- `lib/bills.ts` decides which shares count as debts, whether a bill is settled, and its status. `flows.md` replaces the "Mark paid / Paid · Undo" buttons with tick boxes.
- **Checks:** lint, build, and a new end-to-end step that splits a dinner with Josh and Julie and then:
  - ticks Julie, then Josh, then unticks Josh;
  - checks the toast and that Copy amounts disappears;
  - reloads to confirm the ticks were saved;
  - checks Home shows "1 of 2 paid".

  All 15 end-to-end checks pass.

**Pushed back:** Nothing. This was the planned "Mark paid", built as tick boxes because you asked to check people off.

## Step 8: Greek Summer design system (2026-10-19)

**Asked:** Use the Greek Summer design system from the recipe-book project (in the same projects folder) and make everything in that style.

**Made:**
- **Read the source:** recipe-book's `app/_ds/themes.ts` (colours, type roles, shape), `app/_ds/components.tsx`, `app/_fonts.ts` and `globals.css`, then carried them over:
  - **Tokens in `app/globals.css`:** navy `#14305C` text on warm white `#F7F5F0`, a limestone `#E7DCC6` line, and Aegean blue `#1D4E9E` reserved for the main action. Light-blue `#BCD4EC` with a navy edge marks selected chips, a navy `check` fills checkboxes and radios, the gold badge, and a 2px focus ring. It's light only, like the source, so the dark mode is gone. Every pair was checked against AA: text 4.5:1, field outlines 3:1.
  - **Type:** Marcellus (via `next/font`, no package) for page titles, card headings and the app name, and Manrope for everything else. Field labels are small uppercase, as in the recipe-book.
  - **Shape:**
    - pill-shaped buttons and chips;
    - 12px fields;
    - 20px cards with a thin limestone line and no shadow;
    - 6px checkboxes;
    - a slight shrink when pressed.
- **Components:**
  - Buttons: the primary is Aegean blue; the secondary is a white pill with a slate outline.
  - Chips and How to split / Repeats: light-blue selected chips with a tick.
  - Who paid: Greek Summer radios.
  - Paid tick boxes: navy checkboxes.
  - The toast is navy.
  - Home: One-time is the one blue main action and Recurring is a white card, under a small arch drawing (whitewashed arches, blue doors, a gold sun) taken from the style's artwork.
- **Docs:** added the look to `flows.md` and AGENTS.md.
- **Checks:**
  - A first build kept serving the old stylesheet because of a stale Turbopack cache in `.next`. Deleting `.next` fixed it. If old styles show up in `npm run dev`, do the same.
  - Lint, build, all 15 end-to-end checks, and screenshots of Home, the form, the bill page and the error state.

**Pushed back:** Nothing.

## Step 9: The bill page and who owes you (2026-10-19)

**Asked:** Build the bill page with:
- each person's share and how it was worked out (their items, their share of tax and tip);
- a "Mark paid" control per person;
- "Copy message", which copies a short text like "Dinner: you owe me $23.40".

Home shows who owes me what across all bills. Commit.

**Made:**
- **Bill page:**
  - The title, then "Oct 19 · $78.40 · You paid", then a headline naming who still owes ("Josh and Julie owe you $68.27") with "0 of 2 paid".
  - One card per person:
    - their share in large type;
    - a status ("Owes you" or "Paid you back");
    - how it was worked out. By item: each item they had (shared ones say "shared by 3" and show their part), the items subtotal, then "Tax and tip (26% of items) +$12.16". Evenly: "$90.00 split 3 ways". The lines always add up to the saved share (`lib/breakdown.ts`).
  - My own share gets a card too, without the controls.
- **Mark paid:** a Greek Summer checkbox on each card (a new shared Checkbox; it replaces Step 7's tick rows). Screen readers hear "Mark paid for Josh". A paid amount is struck through. On a bill someone else paid, Mark paid sits on my card and means I've paid them back.
- **Copy message:** on each unpaid person's card. It copies "Dinner at Aba: you owe me $58.16" and confirms "Copied a message for Josh." It replaces the single group "Copy amounts" text from Step 6.
- **Home's "Who owes you":** one row per person with their total across all bills I paid. Amounts are kept per currency, never converted (`lib/balances.ts`). The row also says which bills it's for, as links ("For Dinner at Aba ($58.16)"). Paid shares drop off.
- **Docs:** `flows.md` updated (the bill page wireframe and rules, Copy message, Who owes you) and the main-task diagram in both files.
- **Checks:**
  - lint and a clean build;
  - 16 end-to-end checks, now including the meal breakdown, the label "Mark paid for Josh", and reading the clipboard after Copy message (it held "Dinner with Josh and Julie: you owe me $30.00");
  - Home's "Who owes you" after Julie paid;
  - screenshots of the bill page and Home.

**Pushed back:** Nothing.

## Step 10: Coming back (2026-10-19)

**Asked:** Build the returning experience. Returning visitors get a Home designed for coming back, not the first-visit screen:
- "Welcome back";
- who still owes me, and for how long;
- whether I owe anyone;
- recurring bills that are due.

Also reflect these changes in `flows.md`.

**Made:**
- **Two faces for Home** (`components/home/home-view.tsx`):
  - With no bills, it's the first-visit screen.
  - With any bill, it's "Welcome back".
  - Until saved data is read, it shows the neutral shell, never the wrong one. (So the quick starts are no longer prerendered on the server.)
- **Welcome back:**
  - A one-line summary ("You're owed $133.56. You owe $60.00. 1 recurring bill is due.", or "Nobody owes anyone right now."), plus New one-time bill (the main action) and New recurring bill.
  - **Who owes you:** each person's total across bills I paid, "Unpaid since today / for 3 days / for 2 weeks / for 2 months" measured from their oldest unpaid bill (a month or more in bold), and the bills as links with dates.
  - **You owe:** the same for bills someone else paid where my share isn't paid back.
  - **Recurring bills:** due ones first, with "Add Oct 15"; others show "Next Nov 1".
  - **Your bills:** last.
- **Add the next recurring bill:**
  - `/new/recurring?series=<id>` fills in the name, people, payer and how often, dated when it was due, with the cursor in the blank Amount.
  - Saving continues the same series instead of starting a new one.
  - Due dates step by the frequency. Monthly bills keep the first bill's day, clamped in short months (`lib/recurring.ts`, `lib/dates.ts`).
  - The search param is read inside Suspense, as Cache Components require.
- **Not netted:** Who owes you and You owe are separate lists, as you asked, so `flows.md`'s "net per person on Home" moves to the person page along with Settle up.
- **Bug found and fixed:** Next keeps visited pages alive (hidden), so a hidden One-time form and a visible Recurring form both had fixed ids like `add-person` and `total`. That could point labels and errors at the hidden copy. The form's ids now come from `useId`. Also, the form now resets when switching between "Add Oct 15" and a blank recurring bill.
- **`flows.md`:** Decision 5, the routes, a rewritten Flow 3 (wireframe, rules and states), and the Flow 3 diagram in both `flows.md` and `README.md`.
- **Checks:**
  - lint and a clean build;
  - 6 new logic tests: month-end dates, due-first ordering, durations, per-person balances, breakdowns, and keeping one series;
  - a new end-to-end step: a recurring bill Jo paid starting in August, then "You owe Jo", "Due Sep 1" listed first, "Add Sep 1" opening the filled-in form with the cursor in Amount, saving to "Add Oct 1", still 2 series;
  - all 17 end-to-end checks with no console errors;
  - a screenshot of the returning Home with realistic data.

**Pushed back:** Nothing.

## Step 11: Hierarchy, recent bills, a seamless header, quick-start copy (2026-10-19)

**Asked:**
- Create more of a hierarchy: highlight new one-time and new recurring bills over Who owes you.
- Replace "Your bills" with recent bills: the most recent one up top, the rest moved down, about 5 shown, and a See all page.
- Integrate "Bill Splitter" into the page instead of a separate bar at the top.
- On the first visit, remove "Pick one to start…" (it's redundant).
- Change the card text to "A meal, ride, or anything once" and "Rent, subscription, or anything that repeats".

**Made:**
- **Hierarchy on the returning Home:**
  - "Welcome back" and its summary.
  - The two big quick-start cards, the same as on a first visit: One-time is the Aegean-blue main action, Recurring is a white card. They replace the two small buttons.
  - The section headings below (Latest bill, Who owes you, You owe, Recurring bills, Recent bills) became quiet small-uppercase labels, so the cards lead.
- **Latest bill:** the most recent bill sits in its own card right under the quick starts. It shows the name, total, date and who still owes on it ("Sam owes you $12.40"), and the whole card opens the bill.
- **Recent bills:** the next 4, newest first, at the bottom (5 in all with the latest). "See all N bills" appears when there are more, and opens a new `/bills` page (All bills) grouped by month. A shared BillRow / BillList now serves both lists, and a shared `billHeadline` serves the bill page and the Latest bill card.
- **Header:** the white bar and its border are gone. "Bill Splitter" now sits at the top of the page on the same warm white, in Marcellus, with a small arch (light-blue arch, Aegean-blue door), and still links Home. The private-browsing banner became a rounded notice in the same column.
- **First visit:** the arches, "Split a bill" and the two cards, with no explanation line.
- **Copy:** "A meal, ride, or anything once" and "Rent, subscription, or anything that repeats", on both the first visit and the returning Home.
- **`flows.md`:** Decision 1, the routes (`/bills` added), the navigation rule, the Flow 1 wireframe and Empty state, and a rewritten Flow 3 (the order, Latest bill, Recent bills, See all). Diagram labels updated in both `flows.md` and `README.md`.
- **Checks:**
  - lint and a clean build;
  - all 17 end-to-end checks, now also covering the header (no bar, no border), Home's order, exactly 4 recent bills, See all opening all 6 bills newest first, and the new copy. Text matching is now case-insensitive, because the section labels are uppercase in CSS;
  - screenshots of the returning Home, All bills and the first visit.

**Pushed back:**
- The new-bill buttons were too small next to the lists.
- "Your bills" became Latest bill plus Recent bills.
- The header bar felt separate from the page.
- The first-visit line was redundant.
- New card text.

## Step 12: A friendlier copied message (2026-10-19)

**Asked:** For the copied message, use the event's name, then what they had and how much each part was, to give a total, instead of "you owe me X", which feels blunt to send a friend.

**Made:**
- `lib/messages.ts` builds each person's message from the same breakdown as their card, so the two always match. By item:

  ```
  Dinner at Aba (Oct 5)
  Lamb shoulder: $38.00
  Mezze (shared by 3): $8.00
  Tax and tip: $12.16
  Your total: $58.16
  ```

  Evenly: "Uber home (Oct 19) / $24.80 split 2 ways / Your total: $12.40". The tax and tip line only appears when there was any.
- `flows.md` updated (Decision 11 and the Copy message rule).
- **Checks:** logic tests for the by-item and even messages; in headless Chrome, the clipboard held "Dinner with Josh and Julie (Oct 19) / $90.00 split 3 ways / Your total: $30.00". All 17 end-to-end checks pass.

**Pushed back:** "You owe me $X" was too blunt.

## Step 13: Cohesive money type, Who owes you first (2026-10-19)

**Asked:** Make the style more cohesive, e.g. money in one font (right now "$100" looks very different from "33.33"). Move Who owes you above Latest bill.

**Made:**
- **Why amounts looked different:** big amounts (the share on each card, the Latest bill total) and the bill page's headline ("Josh owes you $58.16") were in Marcellus. Its numerals look nothing like Manrope's, which every other amount used.
- **One money style:**
  - New `type-money` (Manrope semibold, even-width lining digits) for every amount: share cards, the Latest bill total, the bill rows, Who owes you / You owe totals, and the form's live summary.
  - New `type-lead` (Manrope, 20px, semibold) for the bill page's headline.
  - Even-width digits on the whole page, so amounts line up in lists.
  - Marcellus is now only for names and titles. `flows.md`'s Look rule says so.
- **Home order:** new-bill cards → Who owes you → You owe → Latest bill → Recurring bills → Recent bills. I kept You owe next to Who owes you so the two balance lists stay together. Updated the `flows.md` wireframe and hierarchy rule, and the comment in `home-view.tsx`.
- **Checks:** lint, a clean build, all 17 end-to-end checks (the Home order check now expects Who owes you before Latest bill), and screenshots of the returning Home and a bill page.

**Pushed back:**
- Money in two different fonts looked inconsistent.
- Who owes you should come before Latest bill.

## Step 14: A bare first visit (2026-10-19)

**Asked:** On the first-visit page, remove "Bill Splitter" and the illustration, leaving just "Split a bill".

**Made:**
- The first-visit Home is now only "Split a bill" and the two quick-start cards. The arch illustration is gone (component deleted).
- **Header:** it moved into a small client component, SiteHeader.
  - It hides itself on Home until saved data is read, and stays hidden if there are no bills. So a first visit never shows the app name, and a returning visit shows it together with the rest of the page, with no pop-in.
  - Every other page always shows it. It sits in Suspense with the plain header as its fallback, because `usePathname` needs that on pages with an id under Cache Components.
  - The small arch beside the name stays.
- **`flows.md`:** the navigation and look rules, the Flow 1 wireframe and its Loading / Empty states, and the Flow 1 diagram in both `flows.md` and `README.md`.
- **Checks:** lint, a clean build, all 17 end-to-end checks, and a first-visit screenshot. The end-to-end checks now confirm a first visit has no header and no illustration, and that the header (no bar, no border, "Bill Splitter, home") is back once there's a bill.

**Pushed back:** The app name and illustration were too much for the first screen.

## Step 14, continued: Lighter lists for a clearer hierarchy (2026-10-19)

**Asked:** Make Latest bill smaller, and Who owes you smaller and less bold, so the hierarchy is clearer. Push these changes.

**Made:**
- **Latest bill** is now a compact row like the recent bills: the name, then the date and who still owes ("Oct 19 · Sam owes you $12.40") underneath, and the total on the right. It used to be a big card with a Marcellus title.
- **Who owes you and You owe:** rows are 15px with tighter spacing, regular-weight names and medium-weight amounts (were semibold). "Unpaid for 2 months" is medium instead of semibold.
- **The result:** "Welcome back" and the two quick-start cards clearly lead, and the lists read as detail.
- **`flows.md`:** the hierarchy rule, the Latest bill rule and the wireframe.
- **Checks:** lint, a clean build, all 17 end-to-end checks, and a screenshot of the returning Home. Then pushed.

**Pushed back:** Latest bill and Who owes you were still too heavy next to the new-bill cards.
