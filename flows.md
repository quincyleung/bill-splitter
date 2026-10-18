# Flows

Agreed in step 2. These are the screens, routes, states and errors for the three flows: first visit, the main task, and coming back later. Build against this, and change it here when we change our minds.

Main task: add a bill → choose who was there and how to split it → see what each person owes me → mark them paid. Data stays on my phone, and friends never sign in.

## Decisions

| # | Decision | Chosen |
|---|---|---|
| 1 | Tax and tip input | One "Total paid, including tax and tip" field. Tax and tip are the difference from the items, shared in proportion to each person's items. |
| 2 | Forms | Two forms (by item, even split), three start buttons. Monthly uses the even-split fields. |
| 3 | Person page with "Mark all paid" | Keep |
| 4 | Edit a saved bill | Keep, built after the core flows |
| 5 | Autosaved draft | Keep. One draft at a time. |
| 6 | Copy amounts | Keep |
| 7 | iPhone data loss | Installable to the Home Screen (web app manifest). Export/Import backup later. |
| 8 | Currency | **Open:** pick one before building the first form. It will be hard-coded. |
| 9 | Monthly split | Even only |

## Rules every flow follows

| Route | Screen |
|---|---|
| `/` | Home: empty on the first visit, a dashboard after that |
| `/new/meal` | Split a meal by item |
| `/new/even` | Even split: Uber rides, or a meal split evenly |
| `/new/monthly` | Monthly bill (`?from=<billId>` fills in last month's bill) |
| `/bills/[id]` | One bill: who owes what, mark paid, copy amounts, edit, delete |
| `/bills/[id]/edit` | Edit a bill |
| `/people/[id]` | One person: everything they owe me, plus "Mark all paid" |

- **Me:** I'm a person in every split, included by default with my own items. My share is shown but never counted as owed. I can untick myself if I paid but wasn't there.
- **People are saved automatically** the first time I type a name. The picker lists the people I used most recently first.
- **Money is stored in cents.** Shares always add up to the exact total, and leftover pennies go to me, so a friend is never overcharged.
- **Loading state:** saved data can only be read in the browser, so each page shows a neutral shell until it has loaded. A returning user never sees a flash of the empty first-visit screen.
- **Number fields** open the decimal keypad and accept `12`, `12.5` or `$12.50`.
- **On Save:** errors appear next to their fields, focus moves to the first one, and nothing typed is cleared.

## Flow 1: First visit, nothing saved

**Screens and routes:** `/`, then the first bill form.

```
Bill Splitter
Split a bill you paid, see who owes you,
mark them paid. Saved on this phone only.
Friends don't need the app.

[ Split a meal by item ]
[ Split evenly (Uber…) ]
[ Add a monthly bill   ]
```

| State | What I see |
|---|---|
| Loading | Just the app name, with no buttons yet. |
| Empty | The welcome text and three start buttons above. No sign-up, no tutorial, no asking for my name. |
| Partly filled | On the first form, "Who was there" shows only **Me** plus an "Add a person" field, because nobody is saved yet. |
| Error | Storage blocked (private browsing, or storage turned off) → banner: "This browser isn't saving data, so bills will disappear when you close it. Turn off private browsing to keep them." The app still works for this session. |
| Success | The first bill saves and opens `/bills/[id]`. From then on, Home is the dashboard (Flow 3). |

## Flow 2: Main task (add → split → owes → paid)

### Meal by item: `/new/meal`

The most important form. One page, one column, in receipt order. People come before items because items need people to assign.

```
What was it? (optional)   [ Dinner at Nopa ]
Date                      [ Oct 18, 2026   ]

Who was there
[✓ Me] [✓ Sam] [ Alex ] [✓ Jo]
Add a person [ Name      ] [Add]

Items
  Price [ 18.00 ]   Name (optional) [ Burger ]
  Who had it  [Me] [Sam ✓] [Jo] [Everyone]
  [Remove item]
  [+ Add item]

Total paid, including tax and tip  [ 102.20 ]
Items $84.00 · tax and tip $18.20 (22%)

Who owes you
  Sam  $40.25  (items $33.00 + $7.25 tax and tip)
  Jo   $28.10
  Your share $33.85
[ Save bill ]
```

- A shared item (appetizer, a pitcher) gets ticked for several people, or for **Everyone**, and is split evenly between them.
- Tax and tip (total paid minus the items) are spread in proportion to each person's item subtotal.
- The summary at the bottom updates as I type, so I can check it against the receipt before saving.

### Even split: `/new/even`

Fields: what was it (defaults to "Uber ride"), date (today), amount, who was there. Shares are amount ÷ people, with leftover pennies going to me.

### Monthly bill: `/new/monthly`

Fields: name ("Electricity"), month (this month), amount, roommates. Split evenly. Saving it creates a monthly series, so next month is one tap away (Flow 3).

### The bill: `/bills/[id]`

```
Dinner at Nopa · Oct 18 · $102.20
Sam and Jo owe you $68.35 · 0 of 2 paid

Sam   $40.25   [Mark paid]
Jo    $28.10   [Mark paid]
Your share $33.85
[Show breakdown]  (each person's items)

[Copy amounts]  [Edit]  [Delete]
```

- **Mark paid** switches to "Paid · Undo". Paid status is just yes or no.
- **Copy amounts** puts text like "Dinner at Nopa (Oct 18): Sam $40.25, Jo $28.10" on the clipboard to paste into the group chat.
- **Edit** opens `/bills/[id]/edit` with the same form, filled in. If a person already marked paid ends up with a different share, they go back to unpaid: "Sam's share changed from $40.25 to $43.10, so they're unpaid again."
- **Delete** asks first: "Delete Dinner at Nopa? This can't be undone."

### States

| State | What I see |
|---|---|
| Empty | Me is ticked and there's one blank item row. Summary: "Add who was there and what they had." |
| Partly filled | Items entered, no total yet → summary shows item subtotals with "+ tax and tip once you enter the total". The draft is saved as I go. |
| Error | Pressing Save with problems shows each message next to its field and moves focus to the first. Nothing is cleared. |
| Success | Opens `/bills/[id]` with a "Saved" message that screen readers announce. When everyone is marked paid: "Everyone's paid you back", and the bill moves to Settled. |

### Errors

| Where | Problem | Message |
|---|---|---|
| Who was there | Only me | "Add at least one other person to split with." |
| Add a person | Blank | "Type a name, then press Add." |
| Add a person | Name already saved | "Sam is already in the list. Tap their name to include them." |
| Item price | Blank or not a number | "Enter a price, like 12.50." |
| Item price | 0 or less | "Enter a price above 0." |
| Item | Nobody ticked | "Choose who had this item." |
| Items | No items | "Add at least one item from the receipt." |
| Total paid | Blank | "Enter the total you paid, including tax and tip." |
| Total paid | Less than the items | "That's less than the items ($84.00). Check the total, or remove an item that isn't on the receipt." |
| Amount (even split, monthly) | Blank or invalid | "Enter the amount, like 24.80." |
| Name (monthly) | Blank | "Name this bill, like Electricity." |
| Save | Storage full or blocked | Shown near Save: "Couldn't save on this phone. Everything you typed is still here. Try again." |
| Mark paid | Couldn't save | The toggle switches back, with "Couldn't save that. Try again." |

**Warnings that don't block Save:**
- "Jo isn't on any item, so they owe $0. Tick them on an item or remove them."
- "Tax and tip come to 45% of the items. Check the total."
- On a monthly bill: "You already added Electricity for October."

**Unticking a person** who's on items takes them off those items. Any item left with nobody shows its "Choose who had this item" error.

## Flow 3: Coming back next week or next month

**Screens and routes:** `/` (dashboard), `/bills/[id]`, `/people/[id]` and `/new/monthly?from=<id>`.

```
[ Split a meal ] [ Split evenly ] [ Monthly bill ]

Unfinished meal from Tue   [Continue] [Discard]

Owed to you  $142.50
  Sam   $60.20 · 2 bills   >
  Jo    $28.10 · 1 bill    >

Monthly
  Electricity · Sep $84.00   [Add October]

Bills
  Dinner at Nopa · Oct 18 · 0 of 2 paid
  Uber to SFO · Oct 12 · 1 of 1 paid
  > Settled (6)
```

- **"Sam paid me back":** tap Sam to open `/people/[id]`, which lists their unpaid bills with Mark paid on each and one "Mark all paid ($60.20)" button.
- **Next month's utilities:** "Add October" opens the monthly form with the name and roommates filled in, and focus on the empty amount field. Nothing runs on a schedule; I add it when the bill arrives.

| State | What I see |
|---|---|
| Loading | The neutral shell. Never the empty welcome screen. |
| Open bills | The dashboard above, with unpaid bills first. |
| Partly settled | Each bill shows "1 of 3 paid". Each person shows their remaining total. |
| All settled | "Nobody owes you anything right now." The add buttons and Settled list stay. |
| Draft waiting | The "Unfinished…" card. Discard asks first. |
| Month already added | "October added" replaces the button. |

### Errors

- **Saved data can't be read** (damaged, or from an older version) → "Couldn't read your saved bills." The data isn't wiped silently. Instead there are two choices: **Download my data** (a file) or **Start fresh** (asks first).
- **Bill or person not found** (deleted, or a link opened on another device) → "This bill isn't on this phone. It may have been deleted." plus a link to Home.
- **iPhone risk:** Safari can delete a site's saved data after 7 days of using Safari without opening the site. Sites added to the Home Screen are exempt, so the app is installable to the Home Screen.

## Cut

- **Partial payments** ("Sam paid $20 of $40"): paid is yes or no only.
- **Friends owing each other, or more than one payer:** I'm always the one who paid.
- **Uneven monthly splits** (rent by room size)
- **Discounts and coupons on meals:** a total below the items counts as an error.
- **Groups** ("Roommates")
- **A page to manage people** (rename or delete)
- **Automatic monthly bills and reminders**
- **More than one currency**
- **Search and filters** on the bills list
- **Keeping two open tabs in sync**
- **Export/Import backup** (later, not now)
- **Receipt scanning, links that friends can view, syncing between devices:** ruled out by the constraints in AGENTS.md.
