# Research: how other bill splitters welcome someone new

Researched 2026-10-19. Three agents worked in parallel, one per app: Splitwise, Tricount and Settle Up. They used public sources only: help centres, App Store and Google Play pages, release notes, reviews, the apps' own public web files, and walkthroughs. **Nobody tested the apps on a phone**, so the first-screen details and step counts are partly inferred. The gaps are listed at the end.

## Comparison

| | Splitwise | Tricount | Settle Up |
|---|---|---|---|
| **First screen** | A sign-up or log-in gate. On the web, an "Introduce yourself" form asks for name, email, password and currency. No guest mode or intro tour found. | The current screen isn't documented anywhere public. The site says "Try tricount without signing up", and sample tricounts have been in the app since May 2025. | Three intro slides, then "Sign in to allow for backup and synchronization of your groups" with Google, Apple or email. |
| **Account before anything useful** | **Required, can't be skipped.** Email and password, Google (web and Android) or a magic link. | **Not needed for the first group.** One October 2026 tester was asked for an email on their second group, but the App Store says "no limit on tricounts", so sources conflict. Signing up may also open a bunq bank account; the wording is unclear. | **Required, no guest mode since 2019.** "Groups need to be created online due to sync technology limitations." |
| **Your name** | Typed on the sign-up form | You pick "Me" when you create or join a tricount | Taken from Google or Apple, or typed at email sign-up |
| **Group first?** | No: you can add an expense with a friend directly | **Yes:** title, currency and people's names come before the first expense | **Yes:** name, currency and colour, then an "Invite your friends" screen you can skip |
| **Adding people** | In the app: a name plus an email or phone number. Name-only people can only be added on the web. | Typed names, up to 50 | Typed names, or picked from contacts |
| **Steps to a first split** (one screen or required input each) | **About 10:** about 5 to sign up and about 5 to add the expense. A group adds about 3. Partly inferred. | **About 10:** about 5 screens and 4–5 inputs, with no sign-up. Partly inferred. | **About 8** with Google or Apple sign-in, **about 11** with email |
| **First-expense defaults** | Paid by you, split equally | Paid by Me, split between everyone | Paid by you, for everyone, split equally |
| **Empty state and help** | No tour or sample data found. UX critiques say the "+" button gives no guidance. | Sample tricounts instead of an empty list | "Hello!" with a hint about invites, example placeholders ("e.g. Burgers @ Wendy's"), and 16 in-app tips |
| **Ads, limits, upsells** | Free tier: 4 expenses a day according to the official help, though 2026 reviews report 2–3, plus a 10-second countdown. Pro prompts appear early. | No ads or paywall (Premium was dropped in 2024). A bunq card tab and a "Finish signing up" pop-up. | A full-screen ad after every 3rd expense, plus a "Go ad-free" Premium carousel |
| **Do friends need the app or an account?** | An account to view or add expenses (the website works). A new "Itemize" QR flow (US and UK, October 2026) lets guests join with neither. | Joining needs the app, but a friend can just be a name | A view-only web link: "They won't have to log in" |
| **What reviews say** | **+** easy once everyone's on it. **−** everyone has to sign up, the daily cap, the paywall. | **+** fast, free, no ads. **−** the app is now required, the 2024 redesign removed features, worries about bunq. | **+** "fastest expense adding", view links. **−** slow to add people, unskippable ads, forced login. |

**Our planned flow, for comparison** (`flows.md`, Flow 1 into Even split): tap **Even split**, type a friend's name, press **Add**, enter the amount, press **Save**. That's **about 5 steps**, because a person you've just added is ticked automatically.

## Patterns worth using

1. **Start with the task, not a sign-up.** Tricount's "Try tricount without signing up" is its most-praised trait. Forced login is the most-quoted complaint about the other two, for example "I don't want to be linked with Facebook or google" (Settle Up) and family members "not interested in joining Splitwise just to do math".
   *For us:* we already have no accounts. We should also skip intro slides: the welcome text sits directly above the three start buttons.
2. **A name is enough to add someone.** Settle Up and Tricount take typed names. The Splitwise app wants an email or phone number, which slows down the first split.
   *For us:* name only, as planned. Someone you've just added should also be ticked automatically.
3. **Default the first expense to "paid by me, split between everyone".** All three apps do this, and it's why their expense step is short.
   *For us:* Me paying and ticked, everyone added ticked, and the currency filled in, so an even split only needs an amount.
4. **Show examples instead of a blank form.** Tricount uses sample tricounts, and Settle Up uses hints like "e.g. Burgers @ Wendy's".
   *For us:* example hint text under the labels ("like Dinner at Nopa"), but no sample bills. Fake bills would mix into the real balances stored on the phone.
5. **Give friends something they can read without the app.** Settle Up's view-only link and Splitwise's Itemize QR code both exist because asking friends to sign up is the biggest drop-off.
   *For us:* links are ruled out (local only), so the "Copy amounts" text has to stand on its own. For example: "I paid for Dinner at Nopa (Oct 18). Sam $40.25, Jo $28.10."

## Patterns to avoid

1. **An account wall before first use** (Splitwise, Settle Up). It produces the angriest reviews, and it costs 3–5 steps before anything happens. Our design already avoids it.
2. **Building a group before the first bill** (Tricount, Settle Up). Title, currency and members come before you can enter a single amount. That's the wrong order for someone standing at the table who has just paid.
   *For us:* keep it bill-first. People are saved as you go, and the recurring series remembers roommates.
3. **Interrupting early use with limits, ads or promotions.** Splitwise has a daily cap, a countdown and a paywall after a few expenses. Settle Up shows an ad after every 3rd expense. Tricount pushes the bunq card.
   *For us:* none of these. Even our own "Add to Home Screen" tip should only appear after the first bill is saved, never before or during it.

## Changes made to flows.md

All four were added to `flows.md` on 2026-10-19:

- A person you've just added is ticked automatically.
- Example hint text under fields, and no sample bills.
- The Home Screen tip appears once, after the first save, and can be dismissed.
- The "Copy amounts" text stands on its own: "I paid for Dinner at Nopa (Oct 18). Sam $40.25, Jo $28.10."

## Gaps and caveats

- **No device testing.** The Splitwise mobile first launch and the current Tricount first screen weren't found in any public walkthrough, so those rows are partly inferred. The step counts follow the same rule (one screen or required input each) but are estimates.
- **Sources conflict:**
  - the Splitwise daily cap (4 according to the official help, 2–3 according to 2026 reviews);
  - whether Tricount needs an account after the first group;
  - whether Tricount sign-up opens a bunq account.
- **Settle Up details** partly come from its public English string file and web app code. These show what text exists, not exactly where it appears on mobile.
- **Some sources are competitors' blogs** (KittySplit, Splital, HippoSplit, Banana Split, Finny, AreWeEven), so they may be biased. They're used only where official sources were silent.

## Sources

**Splitwise**
- https://kb.splitwise.com/getting-started/how-do-i-use-splitwise
- https://kb.splitwise.com/getting-started/can-i-add-a-friend-without-adding-their-email-address-or-phone-number
- https://www.splitwise.com/signup
- https://www.splitwise.com/privacy (2026-05-26)
- https://kb.splitwise.com/pro/what-is-splitwise-pro
- https://feedback.splitwise.com/knowledgebase/articles/2010350-why-am-i-seeing-an-expense-limit
- https://feedback.splitwise.com/knowledgebase/articles/651235-why-does-the-android-app-ask-for-so-many-permissio
- https://finance.yahoo.com/small-business/articles/splitwise-launches-feature-takes-awkwardness-123000659.html (2026-10-14, Itemize)
- https://apps.apple.com/us/app/splitwise/id458023433
- https://www.trustpilot.com/review/splitwise.com
- https://www.tapsmart.com/tips-and-tricks/splitwise-guide/ (2026-04-06)
- https://www.itvoice.in/splitwise-has-introduced-restrictions-on-the-number-of-free-expenses-users-can-add (2023-12-30)

**Tricount**
- https://tricount.com/
- https://apps.apple.com/us/app/tricount-split-group-bills/id349866256 (version history)
- https://help.tricount.com/articles/whats-new-in-tricount-update-1100 (sample tricounts)
- https://x.com/tricount/status/1747260447223623759 (web app shut down, January 2024)
- https://help.tricount.com/articles/tricount-faqs
- https://help.tricount.com/articles/how-can-i-manage-my-tricounts-and-expenses
- https://help.tricount.com/articles/who-can-sign-up-for-a-free-credit-card-and-how
- https://help.tricount.com/articles/tricount-effortlessly-share-expenses-with-friends
- https://tricount.com/blog/with-the-new-tricount-app-tracking-group-expenses-is-now-easier-than-ever (July 2024)
- https://www.trustpilot.com/review/tricount.com
- https://splital.com/blog/tricount-vs-splitwise (competitor, October 2026)
- https://community.monzo.com/t/new-tool-for-bill-splitting-tricount-from-bunq/194497 (June 2026)

**Settle Up**
- https://play.google.com/store/apps/details?id=cz.destil.settleup
- https://apps.apple.com/app/id737534985
- https://settleup.app/assets/i18n/en/default.json (the app's English strings)
- https://settleup.app (the web app's sign-in and empty-group screens)
- https://medium.com/step-up-labs/completely-redesigned-settle-up-for-ios-released-658fc47418e5 (2019-05-01)
- https://medium.com/step-up-labs/summary-of-2025-changes-in-monetization-of-settle-up-results-7ad316d559c7 (2025-12-15)
- https://settleup.io/tips
- https://itunes.apple.com/us/rss/customerreviews/id=737534985/sortBy=mostRecent/json (iOS reviews)
