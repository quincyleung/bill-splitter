# Bill Splitter

A bill splitter for group meals, one-time costs like Uber rides, and recurring bills like utilities, shared with friends, roommates and my partner. It's for me: I'm usually the one who paid, and I split on my phone right after paying. It also tracks what I owe when someone else pays, like a roommate covering the utilities. Everything is saved on my phone only, so friends don't need an account or the app.

**Main task:** add a bill → choose who was there, who paid and how to split it → see who owes whom → mark it paid.

## Flows

States are named in the box text, and each kind also has its own outline: **Error:** red, **Empty:** dashed, **Success:** green. Rounded boxes are where a flow starts, and double-edged boxes hand off to another flow. The screens, states and exact error messages are in [flows.md](flows.md).

### 1. First visit, nothing saved

```mermaid
flowchart TD
  start(["Open the app for the first time"]) --> loading["Loading: app name only"]
  loading --> canSave{"Can this browser save data?"}
  canSave -->|No| errStorage["Error: banner 'This browser isn't saving data,<br/>so bills will disappear when you close it.'"]
  errStorage --> welcome
  canSave -->|Yes| welcome["Empty: Home with welcome text<br/>and three start buttons"]
  welcome --> mode{"Which kind of bill?"}
  mode -->|Meal by item| meal["Meal form<br/>/new/meal"]
  mode -->|Even split| even["Even split form<br/>/new/even"]
  mode -->|Recurring| rec["Recurring form<br/>/new/recurring"]
  meal --> noPeople
  even --> noPeople
  rec --> noPeople
  noPeople["Empty: Who was there shows only Me<br/>and an Add a person field"] --> addName{"Type a name, press Add"}
  addName -->|Blank| errName["Error: 'Type a name, then press Add.'"]
  errName --> addName
  addName -->|Name typed| savedPerson["Person added, ticked for this bill<br/>and saved for next time"]
  savedPerson --> mainTask[["Finish the bill: Flow 2"]]
  mainTask --> firstBill["Success: first bill saved,<br/>opens /bills/[id]"]
  firstBill --> homeTip["One-time tip: add to Home Screen<br/>so bills are kept. Dismiss hides it"]
  homeTip --> dashboard[["Home is now the dashboard: Flow 3"]]

  classDef error stroke:#c62828,stroke-width:2px
  classDef empty stroke-dasharray:6 4
  classDef success stroke:#2e7d32,stroke-width:2px
  class errStorage,errName error
  class welcome,noPeople empty
  class firstBill success
```

### 2. Main task

```mermaid
flowchart TD
  start(["Home: tap a start button"]) --> mode{"Which mode?"}

  subgraph mealPath ["Meal by item, split by who had what"]
    meal["Empty: meal form, Me ticked and paying,<br/>Items offers Paste or Type"] --> mealPeople["Tick who was there, choose who paid"]
    mealPeople --> how{"Paste or type the items?"}
    how -->|Paste| paste["Paste receipt text, press Read receipt"]
    paste --> prices{"Any prices found?"}
    prices -->|No| errPaste["Error: 'Couldn't find any prices in that text.<br/>Check you copied the receipt, or type the items instead.'"]
    errPaste --> how
    prices -->|Yes| rows["Item rows added, pasted text kept"]
    how -->|Type| rows
    rows --> assign["Tick who had each item"]
    assign --> total["Enter total paid, including tax and tip"]
    total --> mealSplit["Each person pays for their items plus<br/>a proportional share of tax and tip"]
    mealSplit -.- mealWarn["Warnings that don't block Save:<br/>subtotal mismatch, ticked count vs quantity,<br/>high tax and tip"]
  end

  subgraph evenPath ["Even split, one time"]
    even["Empty: even split form, amount blank"] --> evenPeople["Tick who was there, choose who paid"]
    evenPeople --> evenAmount["Enter amount and currency"]
    evenAmount --> evenSplit["Split evenly between everyone ticked"]
  end

  subgraph recPath ["Recurring, split evenly"]
    rec["Empty: recurring form, name,<br/>amount and Repeats blank"] --> recPeople["Tick roommates, choose who paid"]
    recPeople --> recDetails["Enter name, amount, currency<br/>and how often it repeats"]
    recDetails --> recSplit["Split evenly between roommates"]
    recSplit -.- recWarn["Warning that doesn't block Save:<br/>next one not due yet"]
  end

  mode -->|Meal by item| meal
  mode -->|Even split| even
  mode -->|Recurring| rec
  mealSplit --> partly["Partly filled: summary updates live,<br/>draft saved as I go"]
  evenSplit --> partly
  recSplit --> partly
  partly --> check{"Press Save: any problems?"}
  check -->|Yes| errFields["Error: message next to each field,<br/>focus on the first, nothing cleared"]
  errFields --> partly
  check -->|No| stored{"Saved on this phone?"}
  stored -->|No| errSave["Error: 'Couldn't save on this phone.<br/>Everything you typed is still here.'"]
  errSave --> check
  stored -->|Yes| bill["Success: bill page /bills/[id] says 'Saved'"]
  bill --> payer{"Who paid?"}
  payer -->|Me| owedToMe["Each person owes me their share<br/>Copy amounts to the group chat"]
  owedToMe --> markPaid["Mark paid as each person pays me"]
  payer -->|Someone else| iOwe["I owe the payer my share"]
  iOwe --> paidBack["Press I paid them back"]
  markPaid --> markSaved{"Saved?"}
  paidBack --> markSaved
  markSaved -->|No| errMark["Error: toggle switches back,<br/>'Couldn't save that. Try again.'"]
  errMark --> bill
  markSaved -->|Yes| allPaid{"Every share paid?"}
  allPaid -->|No| bill
  allPaid -->|Yes| settled["Success: 'All paid up',<br/>bill moves to Settled"]

  classDef error stroke:#c62828,stroke-width:2px
  classDef empty stroke-dasharray:6 4
  classDef success stroke:#2e7d32,stroke-width:2px
  class errPaste,errFields,errSave,errMark error
  class meal,even,rec empty
  class bill,settled success
```

### 3. Coming back next week or next month

```mermaid
flowchart TD
  start(["Open the app a week or a month later"]) --> loading["Loading: neutral shell,<br/>never the welcome screen"]
  loading --> readData{"Can saved data be read?"}
  readData -->|Damaged| errData["Error: 'Couldn't read your saved bills.'<br/>Download my data, or Start fresh"]
  errData -->|Start fresh, after asking| firstVisit[["Empty: first-visit Home, Flow 1"]]
  readData -->|Nothing saved, e.g. Safari cleared it| firstVisit
  readData -->|Yes| dash["Home dashboard"]
  dash --> anyOwed{"Does anyone owe anyone?"}
  anyOwed -->|No| allClear["Empty: 'Nobody owes anyone right now.'<br/>Add buttons and Settled list stay"]
  anyOwed -->|Yes| balances["Owed to you and You owe,<br/>net per person, per currency"]
  balances --> person["Person page /people/[id]:<br/>open bills both ways"]
  person --> settleUp{"Settle up?"}
  settleUp -->|Confirm| settledUp["Success: every open bill<br/>with that person marked paid"]
  settleUp -->|Cancel| person
  person --> billPage
  dash --> hasDraft{"Unfinished draft?"}
  hasDraft -->|Yes| draftCard["Unfinished meal card"]
  draftCard -->|Continue| form[["Form with the draft: Flow 2"]]
  draftCard -->|Discard, after asking| dash
  dash --> recurring{"Recurring bill due?"}
  recurring -->|Not yet| nextDate["Row shows 'Next: Oct 29'"]
  recurring -->|Due| addNext["Press 'Add Nov 1': /new/recurring?from=id<br/>with name, people, payer, currency<br/>and frequency filled in"]
  addNext --> form
  dash --> openBill["Open a bill or a saved link /bills/[id]"]
  openBill --> exists{"Is the bill on this phone?"}
  exists -->|No| errMissing["Error: 'This bill isn't on this phone.<br/>It may have been deleted.' Link to Home"]
  errMissing --> dash
  exists -->|Yes| billPage[["Bill page, mark paid: Flow 2"]]

  classDef error stroke:#c62828,stroke-width:2px
  classDef empty stroke-dasharray:6 4
  classDef success stroke:#2e7d32,stroke-width:2px
  class errData,errMissing error
  class firstVisit,allClear empty
  class settledUp success
```
