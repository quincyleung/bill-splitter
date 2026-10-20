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

## Step 15: One type scale, Recent bills, a bigger name, a lower first visit (2026-10-19)

**Asked:**
- Combine Latest bill and Recent bills, with the latest at the top.
- Why do Who owes you and Recent bills look different? Make fonts and sizes uniform per role (heading, body, etc.).
- Remove the illustration next to Bill Splitter.
- Drop "Welcome back" and make Bill Splitter bigger instead.
- On the first visit, move the content lower and leave more margin at the sides.

**Made:**
- **Why they differed:** in Step 14 the balance rows became 15px with lighter names and amounts, while bill rows kept 17px semibold names. Each list had its own markup.
- **One type scale:** nine named roles in `app/globals.css`, listed there and in a table in `flows.md`:
  - Display, 40px Marcellus: Home's title;
  - Heading, 28px: page titles;
  - Title, 22px: card titles and the app name;
  - Lead, 20px Manrope semibold: key figures;
  - Row, 17px medium: every list row's name and amount;
  - Body, 17px;
  - Control, 15px semibold;
  - Small, 14px;
  - Label, 12px uppercase.

  `type-money` is gone: amounts take the role of where they sit, always in Manrope with even-width digits. AGENTS.md now says to use these roles, not raw font sizes.
- **One row layout:** a shared `components/ui/rows.tsx` (RowList, RowText, RowValue) now draws Who owes you, You owe, Recurring bills, Recent bills and All bills, so they're identical. Bill rows' second line now says who still owes ("Oct 5 · Josh owes you $58.16") instead of "1 of 2 paid".
- **Recent bills:** the 5 newest, latest at the top. "See all N bills" appears when there are more. The separate Latest bill component is deleted.
- **Home title:** "Welcome back" is gone. Coming back, Home's h1 is "Bill Splitter" at 40px, and Home never shows the small header. Every other page keeps it as the way back. The header no longer needs saved data, only the path.
- **Arch:** removed (component deleted).
- **First visit:** "Split a bill" and the cards sit a little below the middle of the screen, easier to reach with a thumb, with 32px side margins instead of 16px.
- **`flows.md`:** the navigation, look and new type rules, the Flow 1 wireframe, and Flow 3 (wireframe, hierarchy, Recent bills, states).
- **Checks:**
  - lint and a clean build;
  - all 17 end-to-end checks, updated: Home has no header and a 40px "Bill Splitter" title; the header (with no arch) shows on bill pages; 5 recent bills with the latest at the top; the first-visit title sits below 200px with at least 32px margins; "Julie" is checked by row name in Who owes you;
  - the end-to-end helpers now say which text is missing and can go Home from anywhere;
  - screenshots of the returning Home and the first visit.

**Pushed back:**
- Latest bill should be part of Recent bills.
- Lists looked inconsistent.
- The arch was odd.
- "Welcome back" wasn't needed.
- The first visit sat too high and too close to the edges.

## Step 16: Paste receipt text (2026-10-19)

**Asked:** As a more advanced feature, allow pasting receipt text, as we discussed in Step 2. Make sure the task is complete, then push.

**Made:**
- **Parser (`lib/receipt.ts`):**
  - Finds items by their prices (with or without `$`, thousands commas), not by line breaks, because the phone's text recognition often pastes one long line.
  - A number before a name is the quantity ("7 Deluxe Ayce Adult", "2 x Beer").
  - $0.00 lines are skipped.
  - Reading stops at the first summary label followed by a price (Subtotal, Tax, GST/HST/VAT, Tip, Gratuity, Service charge, Total, Grand total, Amount due), so suggested tips after the total are never read as dishes, and an item merely named like a label ("Tip-top cake") isn't mistaken for one.
  - Subtotal, tax, tip and total are read from the summary.
  - No lookbehind regex, so older iPhones' Safari can run it.
- **In the form (By item):**
  - "Paste receipt text" (a disclosure button) opens a "Receipt text" box with how-to-copy help for iPhone and Android. A new shared TextArea field has the same label, hint and error as the others.
  - **Read receipt** adds the items below any already there and replaces an untouched blank first item. It confirms "Found 5 items, subtotal $258.93. Check them, then tick who had each one." and puts the cursor in the first item's name.
  - The pasted text is kept in the bill's draft, so it survives switching between By item and Evenly.
  - Errors: "Paste the receipt text first, or type the items instead." and "Couldn't find any prices in that text. Check you copied the receipt, or type the items instead."
  - Items with a quantity show "7 × $31.99 on the receipt: tick 7 people", and quantities are saved with the bill.
  - Under Total paid: "Receipt total $341.15. Add any extra tip you left. [Use this]". It's never filled in automatically.
  - New warnings that don't block Save: "Deluxe Ayce Adult is for 7 people. You've ticked 2." and "Items add up to $X, but the receipt subtotal is $Y. A line may be missing."
- **`flows.md`:** rewrote "Reading a receipt" to match what was built, and updated the meal wireframe and items rule.
- **Checks:**
  - lint and a clean build with TypeScript;
  - new parser tests on the real hot pot receipt (5 items, quantities 1/2/1/3/7, subtotal $258.93, tax $30.43, gratuity $51.79, total $341.15) and three other layouts;
  - tests for both new warnings and for saving quantities; all earlier logic and storage tests still pass;
  - a new end-to-end step pasting the real receipt into a bill (both errors, 5 items named and priced, the "7 ×" note, Use this, both warnings, saved bill breakdown), for 17 end-to-end checks, all passing;
  - a screenshot of the items after reading.
- **Correction:** my earlier reports of "17 end-to-end checks" were one too many. There were 16 before this step's receipt check, and 17 now.
- **Pushed** after committing.

**Pushed back:** Nothing.

## Step 16, continued: First visit at a third of the way down (2026-10-19)

**Asked:** Move the first-visit content higher, to about a third of the way down the page.

**Made:**
- The first-visit block ("Split a bill" and the two cards) is now centred on the line a third of the way down the screen. Flexible space above and below it splits one to two, so it holds on any phone height instead of sitting a little below the middle. The wider side margins stay.
- `flows.md`: the Flow 1 wireframe note.
- **Checks:** lint, build, and all 17 end-to-end checks. The placement check now requires the block's centre to sit 28–40% of the way down, with at least 32px margins. Screenshots at 844px and 667px tall both put it at about a third.

**Pushed back:** It sat too low.

## Step 17: Delete a bill (2026-10-19)

**Asked:** When I open a bill, let me delete it, with an "are you sure" before it's deleted.

**Made:**
- **Delete bill** is at the bottom of every bill page.
  - Tapping it replaces the button with an inline question: "Delete Dinner at Aba? This can't be undone.", with a red **Delete bill** and **Cancel**.
  - Focus moves into the question, and Cancel puts it back on "Delete bill".
  - Deleting goes back to Home and shows "Deleted Dinner at Aba."
  - If saving fails, the bill stays, with "Couldn't delete it. Try again."
- **What gets deleted:** `withoutBill` (`lib/bills.ts`) removes the bill and drops a recurring series once its last bill is gone, so it doesn't stay "due". Saved people stay.
- **A new `danger` button style:** Greek Summer's red `#B42318` with a darker hover, white text at 6.6:1 and 9:1. It's used only to confirm something that can't be undone.
- **`flows.md`:** the Delete rule, a new error row, and the bill-page wireframes ("Edit comes later").
- **Checks:**
  - lint and build;
  - a logic test for deleting, including dropping a series only when its last bill goes;
  - a new end-to-end step: open Uber home, Delete bill, check the question and where focus goes, Cancel (nothing deleted, focus back), delete again, check the button is red, then confirm it lands on Home with the toast, the bill is gone from storage and from Recent bills.
  - all 18 end-to-end checks pass.

**Pushed back:** Nothing.

## Step 17, continued: First visit just above the middle (2026-10-19)

**Asked:** The first-visit content is now too high. Move it lower, near the centre but still slightly above it.

**Made:**
- The space above and below the first-visit block now splits two to three (it was one to two). The block's centre now sits about 42% of the way down on both 844px and 667px tall screens: near the middle, a little above it.
- `flows.md`: the Flow 1 wireframe note.
- **Checks:** lint, build, and all 18 end-to-end checks. The placement check now expects the centre 38–48% of the way down. Screenshots at both heights.

**Pushed back:** A third of the way down was too high.

## Step 17, continued: Back to Home on the bill page (2026-10-19)

**Asked:** Add an option at the bottom of the bill to go back to the home page.

**Made:**
- Every bill page now ends with a full-width **Back to Home** (the blue main-action style, since going back is the main next step once a bill's been checked). **Delete bill** sits below it with space between, so the two aren't mis-tapped. The app name at the top still goes Home too.
- `flows.md`: the bill-page wireframes and a Back to Home rule.
- **Checks:** lint, build, and all 18 end-to-end checks. The delete step now also checks that Back to Home links to `/`, sits above Delete bill at full width, and lands on Home. Screenshot of a bill page.

**Pushed back:** Nothing.

## Step 18: A ⋯ menu for Delete, and Share summary (2026-10-19)

**Asked:**
- Instead of Delete bill at the bottom, put three dots on the right of the bill's name that let you delete it.
- At the bottom, add a button for sharing a summary with a group (the whole bill and what each person owes, instead of copying each person's message), with Back to Home on its right.

**Made:**
- **⋯ More options** sits on the right of the bill's name. It's a disclosure button, named "More options for Dinner at Aba" for screen readers.
  - It opens a small menu with **Delete bill**, and focus goes to that item.
  - Escape closes it and puts focus back on ⋯. Tapping outside, or tabbing away, also closes it.
  - Delete bill opens the same "are you sure" question, now under the title. Cancel puts focus back on ⋯.
  - The confirm button is still red, and deleting still goes Home with "Deleted …".
  - The bottom Delete bill is gone.
- **Share summary** is at the bottom left, with **Back to Home** (the blue main action) on its right.
  - `groupSummary` (`lib/messages.ts`) writes one message for the group: the bill and date, "Total $78.40, paid by me", "Split evenly between 3" on even bills, then each person's share, with "(paid)" or "(paid the bill)" and their items with tax and tip on by-item bills. Me is listed last.
  - It opens the phone's share sheet when there is one, so it can go straight to a group chat.
  - Otherwise it copies the text and says "Copied the summary. Paste it into your group chat." Closing the share sheet isn't treated as an error.
  - Each person's Copy message stays on their card.
- New pieces: `components/bill-actions.tsx` (BillMenu, DeleteQuestion, ShareSummaryButton), `shareText` in `lib/clipboard.ts`, and a MoreIcon.
- **Mistake I fixed along the way:** removing the old Delete bill code also cut the per-person share cards that followed it in the file. Lint caught it, and I restored them from the last commit.
- **`flows.md`:** the bill-page rules (the bottom row, the group summary with an example, the ⋯ menu) and both wireframes.
- **Checks:**
  - lint and build;
  - logic tests for the group summary on a by-item bill and on a recurring bill someone else paid;
  - the bill-page end-to-end step, rewritten. It checks:
    - the bottom row (Share summary left, Back to Home right, no Delete bill on the page);
    - Share summary through a stubbed share sheet (exact text) and through the copy fallback (toast);
    - Back to Home;
    - ⋯ on the title's line, opening with focus on Delete bill, and Escape closing it with focus back;
    - Delete opening the question, and Cancel returning focus to ⋯;
    - a red confirm, then deleting goes Home and removes the bill.
  - All 18 end-to-end checks pass. The copy fallback is clicked with a user gesture, as a real tap would be; headless Chrome holds clipboard writes that don't have one.
  - A screenshot of the bill page.

**Pushed back:** Delete was too prominent at the bottom. Sharing one message per person was tedious for a group.

## Step 19: Loading screen, the name only on Home, a delete pop-up, smaller fixes (2026-10-20)

**Asked:**
- After Share summary, just say "Summary copied."
- Drop "(paid the bill)" from the summary, since "paid by" already says who paid.
- Add a pretty loading screen with "Bill Splitter" in the centre, and remove the name everywhere else. Then: add it back on Home, but nowhere else.
- Fix a console error ("A tree hydrated but some attributes … didn't match").
- Make the delete confirmation a pop-up instead of extending down.
- Remove the "Saved" pop-up, since the bill opens anyway.
- Put the example name inside the box ("Dinner at Aba") instead of under the label.
- After Save, show the loading screen instead of the form being cleared.
- Clicking the words "Share summary" shows a pop-up saying "main text". Fix it.

**Made:**
- **Share summary:** the toast is "Summary copied.". The summary marks only who has paid back ("(paid)"); the payer isn't marked again.
- **Loading screen** (`components/loading-shell.tsx`):
  - "Bill Splitter" in Marcellus 40px in the centre, a short gold line, and three softly pulsing Aegean-blue dots. It doesn't animate for people who've turned on reduce motion.
  - It's in the server's HTML, so it shows straight away on any page and covers it until saved data is read.
- **The name:**
  - The header is gone (`site-header.tsx` deleted). "Bill Splitter" appears only on the loading screen and as Home's big title once there are bills. A first visit is still just "Split a bill".
  - Every other page has a small "← Home" link at the top (`components/back-link.tsx`).
- **Delete pop-up:**
  - It's a native modal `<dialog>`: centred, the page behind dimmed and unreachable. It shows "Delete Uber home?", "This can't be undone.", then Cancel and a red Delete bill.
  - Focus starts on Cancel. Escape, Cancel or tapping outside closes it.
  - **Bug found and fixed:** focus didn't return to ⋯ because I moved it while the dialog was still open, and a modal dialog blocks that. It now closes first, then moves focus.
- **No "Saved" pop-up.**
- **After Save:**
  - The loading screen shows for half a second, then the bill opens.
  - The form resets only once its page is hidden (Next keeps it alive in the background). It does that from an effect cleanup with a stable callback, so it's never seen clearing.
- **Examples inside the box:** "Dinner at Aba" (one-time Name), "Electricity" (recurring Name) and "Burger" (item Name) are now placeholder text. The "Like …" lines are gone, and the labels stay real labels. Instructions like "The amount on your card slip, after tip" stay as lines under the label.
- **The "main text" pop-up:**
  - I couldn't reproduce it, but the likely cause is the hidden "Skip to main content" link showing after focus jumped to the top of the page.
  - The skip link now appears only for keyboard focus (`focus-visible`), and Share summary puts focus back on itself afterwards.
  - The end-to-end test now does a real mouse click on the button's words and checks focus stays on the button with the skip link hidden.
- **The console error:**
  - **My mistake:** you keep `npm run dev` running on :3000, so my earlier "dev checks" on another port never started (Next refuses a second dev server), and I wrongly reported them clean. My `rm -rf .next` before builds also deleted `.next/dev` under your live server, which can leave its HTML and the browser's code out of step: a likely cause of the error.
  - **The real check:** I ran it against your server on :3000, read-only, from a clean headless Chrome. Every page rendered its title with and without data, there were no console errors or hydration warnings, the delete pop-up opened, and the dev log was clean.
  - **Added:** `suppressHydrationWarning` on `<html>` and `<body>` only, for attributes browser extensions add there. Everything inside is still checked.
  - **Saved a note** to my memory: never delete `.next/dev`, and check dev mode through :3000.
- **`flows.md`:** navigation (the name only on Home and loading, ← Home, the keyboard-only skip link), the loading screen, Save, examples, the delete pop-up, the summary and toast, the type roles, and the Flow 1 and Flow 2 diagrams (in `README.md` too).
- **Checks:**
  - lint and a production build;
  - the group summary tests;
  - all 18 end-to-end checks. New ones cover: the loading screen in the server's HTML and gone after load; no name or header on bill pages, with ← Home; Save showing the loading screen, not a cleared form; the placeholder; the modal pop-up (focus on Cancel, Escape and Cancel returning focus to ⋯, red confirm); "Summary copied."; and the real-click Share summary check;
  - the clean-browser dev check on :3000;
  - screenshots of the loading screen, a bill page and the delete pop-up.

**Pushed back:**
- Shorter toast.
- Payer not repeated in the summary.
- A loading screen.
- The name only on Home.
- Delete as a pop-up.
- No "Saved" message.
- Examples in the box.
- No visible form reset after Save.
- A stray pop-up on Share summary.

## Step 20: Accessibility pass, Share summary copies only, clearer Custom repeats (2026-10-20)

**Asked:**
- Push Step 19.
- An accessibility pass on every page:
  - logical tab order and visible focus;
  - a real `<label>` on every field;
  - errors linked to their fields (`aria-describedby`) and announced;
  - person chips, toggles and the segmented control working by keyboard;
  - every colour pair checked for AA contrast.
  
  List what changed, then commit.
- A screenshot of the "main text" pop-up: the Mac share sheet showing "Plain Text".
- Remove the example text from the one-time Name and from the recurring Name ("Electricity").
- When Custom is chosen under Repeats, make it clear that the interval belongs to Custom; it looked like separate fields.
- Remove "New names are saved for next time." under Who was there.
- Then put the Name examples back, fainter: "e.g. Dinner at Aba" on a one-time bill and "e.g. Netflix" on a recurring one.

**Made:**
- **The audit:** a headless Chrome script that visits every page and state (first visit, Home with bills, both forms empty, partly filled and after a failed Save, the receipt paste, a bill, the delete pop-up, a person, a missing bill, Custom repeats). It checks:
  - every field has a real label;
  - errors are linked to their fields;
  - every control has a name;
  - there are no duplicate ids;
  - headings are in order;
  - targets are at least 24px;
  - nothing scrolls sideways at 320px;
  - text and placeholder contrast is at least 4.5:1, and outline and checkbox contrast at least 3:1;
  - the tab order doesn't jump backwards up the page;
  - every stop shows a focus ring.
  
  It also tests 17 keyboard paths: chips, radios, segmented controls, Mark paid, the ⋯ menu, the pop-up (focus on Cancel, Tab trapped, Escape) and the skip link.
- **What it found, and the fixes:**
  - **Add person had no real label** (it pointed at the button's text). It now has a visually hidden `<label>`, "Name of someone to add".
  - **The date field showed no focus ring** (Safari and Chrome draw it inside the native control). A focus outline now covers dates too.
  - **Add person errors weren't announced.** They now go to the form's live region.
  - **Save errors weren't announced as a whole.** A hidden alert now says "Couldn't save yet: 2 things need fixing. Moved to the first one." Focus still moves to the first problem.
  - **Receipt paste errors weren't announced.** They now go to its status region too.
  - **The Custom panel tabbed backwards** (Every, then up to Weeks/Months). The row is now level, so it reads and tabs left to right.
- **Passed as they were:** every other label, error link, contrast pair, name, target size and keyboard path.
- **Share summary copies only:**
  - On a Mac, Safari's share sheet shows the text as "Plain Text", with the title and text run together. That was the "main text" pop-up.
  - Share summary now just copies the summary and says "Summary copied."
  - My earlier skip-link theory was wrong. That change (the skip link shown only for keyboard focus) stays, because it's harmless.
- **Custom repeats:** choosing Custom opens a light-blue panel inside Repeats, headed "Custom: how often it repeats (1 to 12 months)", with **Every** and **Weeks or months** side by side. The range in the heading follows Weeks or Months.
- **Hint removed:** "New names are saved for next time."
- **Name examples:**
  - First removed, then put back fainter: "e.g. Dinner at Aba" on a one-time bill and "e.g. Netflix" on a recurring one.
  - All example text inside a box (including "Burger" and "Name") now uses a new `ink-faint` grey (#67758e). That's 4.65:1 on white, the faintest that still meets AA; the old grey was 6.87:1.
  - The recurring blank-name error now says "like Netflix" to match.
- **Checks:**
  - the audit: 0 issues, and all 17 keyboard paths pass;
  - console clean;
  - lint and a production build;
  - all end-to-end checks. The Share summary check now asserts "Summary copied." and that no share sheet opens;
  - screenshots of both forms and the Custom panel.

**Pushed back:**
- The share sheet's "main text" pop-up.
- Examples: first removed, then back but fainter, with "e.g."
- Custom repeats looking like separate fields.
- The "new names are saved" hint.

## Step 21: Picking from lots of people, pop-ups for the receipt, a spaced summary, Custom on one line (2026-10-20)

**Asked:**
- "Is there a better way to organize names, especially when I start splitting with more people? Let's say there are 20 names." I brainstormed seven ideas, and you picked four:
  1. a find-or-add box;
  2. only who's ticked plus a few recent people, with "Show all";
  3. "Same people as" a recent bill;
  6. a compact "Who had it" on big bills.
- Paste receipt text and Read receipt as a pop-up instead of expanding below.
- A line break between the people in the summary text.
- For Custom repeats, remove "Custom: how often it repeats…" and make it one line: Every [ ] [Weeks] [Months].

**Made:**
- **Who was there:**
  - **Chips:** Me and the 6 people used most recently. Anyone found, added or ticked elsewhere gets a chip after them. Chips never move or vanish while the form is open, so focus is never lost; unticking just leaves a chip unticked.
  - **Find or add a person:** the shared AddField became a combobox. Typing lists up to 5 people not yet on the bill, matching the start of the name or of any word ("jo" finds Jo, Josh and Mary Jones), an exact match first. The first is highlighted, and Enter or Add person picks it. The arrow keys move the highlight, Escape hides the list, and a tap picks any of them. "Add “Jo” as someone new" ends the list unless that exact name is saved. No match means Enter adds someone new, as before. Typing a saved name exactly puts that person on the bill, so "Sam is already in the list. Tap their name" is gone.
  - **Same 5 people as Ski trip:** up to two buttons for the people on the newest bills (two different groups, each with two or more saved people besides me). It only ever adds people.
  - **Show all 20 people** (when more people are saved than have chips) opens a pop-up: "Who was there", "5 of 21 ticked", **Find a person**, then Me and everyone A to Z as checkboxes, and **Done**.
- **Who had it with more than 8 people:** one button per item ("Choose who had it", "Sam, Jo + 3 · Change" or "Everyone · Change") beside the Everyone chip. It opens the same pop-up, "Who had Burger", with Everyone, Me, then A to Z. After a failed Save, focus goes to that button.
- **One shared pop-up** (`components/ui/dialog.tsx`):
  - It's a native modal `<dialog>` with a title, optional description, and buttons at the bottom; a long middle scrolls.
  - It's placed at the end of `<body>`, so Enter inside it can't submit the bill form.
  - The delete confirmation now uses it too, plus a checklist pop-up built on it (`checklist-dialog.tsx`).
- **Receipt pop-up:** "Paste receipt text" opens it, with Receipt text (and how to copy it), **Close** and **Read receipt**.
  - Reading closes it and moves focus to the first item.
  - Problems stay next to the box and are read out inside the pop-up. They now say "…or close this and type the items instead."
  - The pasted text is kept for next time it's opened.
- **Summary:** a blank line between each person in the copied summary.
- **Custom repeats:**
  - One line in the light-blue panel: Every [ ] [Weeks] [✓ Months]. TextField gained an inline label, and SegmentedControl gained a legend only screen readers hear.
  - It fits on one line from 360px wide, and wraps at 320px.
  - The error now gives the range: "Enter how often, from 1 to 12 months." (or 52 weeks).
- **Found and fixed while testing:**
  - The hidden inputs of the ticks made the Show all pop-up itself scrollable, which also gave it a stray Tab stop. Its list is now their positioning box.
  - An unnamed item's pop-up said "Who had item I", because Marcellus's 1 looks Roman. It now says "Who had this item".
- **Checks:**
  - logic tests: chips, matching, find-or-add, Same people as, untick, the spaced summary;
  - lint and a production build;
  - all end-to-end checks. A new one uses 20 saved people and covers the chips, find with arrows and Enter, a tap, someone new, Same people as, Show all with find and Escape, and the compact Who had it (Save focus, pop-up, Done). The receipt check now covers the pop-up: focus, errors inside, Close returning focus, and the kept text;
  - the accessibility audit: 0 issues, with new states for the suggestions, both pop-ups and the big bill. 26 keyboard checks pass, including the find box, Show all and Who had it opened by keyboard, with a focus ring;
  - the read-only dev check on :3000 is clean;
  - screenshots of each new screen.

**Pushed back:**
- Twenty names wouldn't fit the old chips.
- Receipt paste looked odd expanded in place.
- A line break between people in the summary.
- The Custom heading wasn't needed.

## Step 22: Two rows of recent people; "Same people as" can be unticked (2026-10-20)

**Asked:**
- Who paid can keep showing everyone ("it won't be that many people").
- Who was there should show the most recent people in two rows; if there are more, they're under Show all.
- Let "Same people as X" be unticked.
- Push the commits.

**Made:**
- **Two rows, measured:**
  - Instead of a fixed 6, Who was there shows Me and as many of the most recent people as fit in two rows on this screen.
  - Invisible copies of the chips (at the end of `<body>`, so they're never mistaken for the real ones) are measured ticked, with the check mark, so ticking people never pushes a chip onto a third row.
  - `lib/rows.ts` works out how many fit. It's measured before the first paint and again when the width changes, such as a phone turning.
  - Show all appears when more people are saved than fit.
  - People found, added or picked from Show all get chips after the two rows, and anyone on the bill always keeps a chip.
- **Same people as is a chip now:**
  - It shows ticked while all its people are on the bill.
  - Unticking it takes them all off the bill (and off any items), leaving their chips unticked.
  - Screen readers hear "Took the 5 people from Ski trip off this bill."
- **Pushed** e466166 and 0b8221e.
- **Checks:**
  - logic tests: fitting rows, a too-wide chip, a narrower screen keeping ticked people's chips, unticking a group;
  - lint and a production build;
  - all end-to-end checks. The 20-people check now covers exactly two rows of the most recent (Me, Josh, Julie, Jo, Mary Jones and Sam at 390px), still two rows with all of them ticked, fewer at 320px and the same ones back at 390px, and Same people as on, off and on;
  - the accessibility audit: 0 issues, and 26 keyboard checks pass;
  - a screenshot.

**Pushed back:**
- Six chips should be "two rows".
- A group you can't take back.

## Step 23: No amounts in the Who owes you line; "Show all" (2026-10-20)

**Asked:**
- Under Who owes you, keep "Unpaid for…" and what it's for, but remove the dollar amount, since it's already on the right.
- Make "Show all 20 people" just "Show all".

**Made:**
- **Home's rows** now read "Josh · Unpaid for 2 weeks · For Dinner at Aba (Oct 5), Uber home (Oct 17)", with $70.56 only on the right. You owe uses the same row, so it changed too.
- **The button** under Who was there now says **Show all**. It now fits beside "Same 5 people as Ski trip".
- **`flows.md`** has the new wording and the Home sketch.
- **Checks:**
  - lint and a production build;
  - all end-to-end checks. The Home check now says the line has the bill and its date, and no "$";
  - the accessibility audit: 0 issues, and 26 keyboard checks pass;
  - screenshots of Home and Who was there.

**Pushed back:**
- The amount was shown twice.
- The count on Show all wasn't needed.

## Step 24: Items: ⋯ to delete, and Item 1, Item 2 as titles (2026-10-20)

**Asked:**
- Instead of a Remove button under each item, put a ⋯ menu on the right that lets you delete it. There are too many buttons at the bottom, especially for a big group.
- Give "Item 1", "Item 2" a clear hierarchy above Name and Price; they looked too similar.

**Made:**
- **⋯ on each item:**
  - It sits on the right of the item's title, shown when there's more than one item.
  - Its menu has a red **Delete item**.
  - Deleting needs no confirmation (nothing is saved yet). Focus moves to Add item, and screen readers hear "Item 2 deleted."
  - The Remove item buttons are gone.
- **One shared menu:** the bill page's ⋯ is now the same component (`components/ui/more-menu.tsx`, "Delete bill"), so both behave alike: Enter opens it with focus on the action, and Escape, a tap outside or focus leaving closes it.
- **Item titles:**
  - "Item 1" is in the Lead style (Manrope 20px semibold, navy), above the 12px uppercase field labels, with more space below it.
  - FieldGroup gained `size="title"`, and Card is now `relative` so the ⋯ can sit in its corner.
  - Marcellus wasn't used, because its 1 looks like a Roman I.
- **A slip I fixed:** I ran Prettier on the changed files, but the project has no Prettier config, so it rewrapped them to 80 columns. I rebuilt those files from the last commit plus only my edits, so the diff has just the real changes.
- **Checks:**
  - lint and a production build;
  - all end-to-end checks. A new one covers 20px semibold titles above 12px uppercase labels, no Remove buttons, no ⋯ on a single item, ⋯ on the title's line at the right, a red Delete item, deleting item 2 with focus to Add item, renumbering, and the announcement;
  - the accessibility audit: 0 issues, including a new state with an item's menu open. 29 keyboard checks pass, including an item's ⋯ by keyboard;
  - screenshots.

**Pushed back:**
- Too many buttons at the bottom of items.
- Item titles that looked like field labels.

## Step 25: A trash can to delete an item; no example in the item name (2026-10-20)

**Asked:**
- Instead of the ⋯ menu for deleting items, a trash icon.
- Remove the example text ("Burger") inside an item's Name.

**Made:**
- **Trash can:** each item (when there's more than one) has a trash can on the right of its title.
  - One tap deletes the item; there's no confirmation, since nothing is saved yet.
  - Screen readers hear it as "Delete item 2", and "Item 2 deleted." afterwards. Focus moves to Add item.
  - The trash can and the bill page's ⋯ are now the same shared round icon button (`components/ui/icon-button.tsx`), and `TrashIcon` was added.
  - The bill page keeps its ⋯ menu.
- **Item names** have no example text. The error still says "Name this item, like Burger."
- **Checks:**
  - lint and a production build;
  - all end-to-end checks. The items check now covers no trash can on a single item, "Delete item 1/2/3" with an icon, deleting item 2 in one click, focus moving to Add item, renumbering, the announcement, and the item name having no example;
  - the accessibility audit: 0 issues, with a 2-item state. 27 keyboard checks pass, including deleting an item by keyboard;
  - a screenshot.

**Pushed back:**
- A menu was one tap too many for deleting an item.
- The item name example wasn't needed.

## Step 26: The date box no longer sticks out on iPhone (2026-10-20)

**Asked:** On my phone, the date field goes past the right side of the screen.

**Made:**
- **The cause:** iPhone Safari draws date boxes natively, and for those it doesn't count the padding and border inside the width. A full-width date box was wider than the screen by its padding and border (about 26px).
- **The fix (in `app/globals.css`):**
  - On iPhone and iPad only (`@supports (-webkit-touch-callout: none)`, an iOS-only property), date boxes are drawn like the other boxes (`appearance: none`), so they fit.
  - The date is left-aligned like the text in every other box (iOS centres it).
  - Desktop and Android keep their own date picker look.
- **Not tested on an iPhone here:** there's no iOS Simulator on this Mac. This is the standard fix for this Safari behaviour, and I've asked you to check it on your phone.
- **Checks:**
  - lint and a production build;
  - all end-to-end checks;
  - the accessibility audit: 0 issues, no sideways scroll at 320px, 27 keyboard checks pass;
  - a desktop screenshot of the form, which looks unchanged.

**Pushed back:** the date field overflowing on a real phone.

## Step 27: Deleting every bill keeps the usual Home, with a blank Recent bills (2026-10-20)

**Asked:** If I delete my bills, don't take me back to onboarding; show a blank state instead.

**Made:**
- **First visit means nothing saved:** Home's first-visit screen now needs nothing ever saved: no bills, no people, no recurring bills (`isFirstVisit` in `lib/bills.ts`). Deleting bills keeps the people I split with, so after deleting every bill Home stays the usual one: "Bill Splitter", "Nobody owes anyone right now.", the two new-bill cards, and Recent bills with "No bills right now. New ones will show here."
- **Start fresh** (which clears everything) still brings back the first visit.
- **`flows.md`:** the Home route, the "first visit or coming back" rule, and a "No bills left" state.
- **Checks:**
  - a logic test for the first-visit rule;
  - lint and a production build;
  - all end-to-end checks. A new one deletes the only bill through ⋯ and the pop-up, then checks Home is "Bill Splitter" with the blank Recent bills, not "Split a bill";
  - the accessibility audit: 0 issues, with a new state for Home with no bills. 27 keyboard checks pass;
  - a screenshot.

**Pushed back:** deleting bills shouldn't feel like starting over.

## Step 28: The date is vertically centred on iPhone (2026-10-20)

**Asked:** The date fix worked, but the date now sits at the top inside the box. Centre it vertically.

**Made:**
- **The cause:** iOS's own date style centres the date with a flex box (items centred). Drawing the box like the others (`appearance: none`) dropped that, and the field's `block` class made it a plain block, so the date sat at the top.
- **The fix:** on iPhone and iPad only, the date box is a flex box with its items centred again, plus a line as tall as the box (44px less the border) as a fallback.
  - The rule now sits outside Tailwind's layers, so it wins over the field's `block` class. Inside the base layer it would lose to the utilities.
  - Confirmed in the built CSS.
- **Not tested on an iPhone here** (no iOS Simulator on this Mac). You confirmed the overflow fix on your phone.
- **Checks:**
  - a production build;
  - all end-to-end checks;
  - the accessibility audit: 0 issues, 27 keyboard checks pass;
  - a desktop screenshot of the form, which looks unchanged.

**Pushed back:** the date sitting at the top of its box.

## Step 29: Show groups: pick a recent event to tick everyone who was there (2026-10-20)

**Asked:** Instead of listing "Same 5 people as Ski trip" chips, have a **Show groups** button. It should show recent events, so I can tap, say, Fam Dinner (Huddy and Chloe) and have everyone who was there ticked.

**Made:**
- **Show groups** (beside Show all, when there are any groups) opens a pop-up, "Recent groups": "Tick one to put everyone from it on this bill."
  - It lists up to 8 recent events, newest first. Each is a checkbox with the bill's name and, underneath, its date and who was there ("Fam Dinner" / "Oct 12 · Huddy and Chloe").
  - Ticking one puts them all on the bill; unticking takes them all off (and off any items). Several can be ticked together, and a group shows ticked while all its people are on.
  - Done, Escape or a tap outside closes it, with focus back on Show groups.
  - Groups are as before: each set of people once (under its newest bill), with at least two people besides me who are still saved.
- **The "Same N people as …" chips are gone.**
- **Shared checklist pop-up:** it gained an optional second line per row, a custom description, and an option to have no find box. Two-line rows get a little space, so a focus ring doesn't touch the next row.
- **Checks:**
  - logic tests: groups carry their bill and date, and the limit;
  - lint and a production build;
  - all end-to-end checks. The 20-people check now opens Show groups and checks the title, description, no find box, and the "Ski trip / Oct 10 · Ana, Bo, Cy, Di, and Ed" row; it ticks, unticks and ticks again, and Done returns focus;
  - the accessibility audit: 0 issues, with a new Recent groups state. 30 keyboard checks pass, including Show groups opening with Enter (focus with a ring on the first group), Space ticking it, and Escape returning focus;
  - screenshots with Fam Dinner (Huddy and Chloe), Ski trip and Internet.

**Pushed back:** inline "Same N people" chips; recent events should be one tap away instead.

## Step 30: Recent groups without the instruction line (2026-10-20)

**Asked:** In Recent groups, remove the text "Tick one to put everyone…".

**Made:**
- **The pop-up** is now just "Recent groups", then the events. Each still shows its date and who was there underneath.
- **The shared checklist pop-up** takes `description={null}` for no line under the title. It then has no `aria-describedby` either.
- **Checks:**
  - lint and a production build;
  - all end-to-end checks. The groups check now asserts there's no description and no "Tick one" text;
  - the accessibility audit: 0 issues, 30 keyboard checks pass;
  - a screenshot.

**Pushed back:** the instruction line wasn't needed.

## Step 31: Blank state just says "No bills right now." (2026-10-20)

**Asked:** For the blank state, remove "New ones will show here." and just have "No bills right now."

**Made:**
- **The text:** Recent bills with no bills now says only "No bills right now." `flows.md` matches.
- **Checks:**
  - lint and a production build;
  - all end-to-end checks. The deleted-every-bill check now also asserts the second sentence is gone.

**Pushed back:** the second sentence wasn't needed.
