"use client";

// The one form behind both quick starts. One-time opens on "Evenly" (the shortest
// form) with "By item" one tap away; Recurring is a monthly, even split. One column; errors appear
// next to their field after Save, and nothing typed is ever cleared.

import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { type FormEvent, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { AddField } from "@/components/ui/add-field";
import { Button } from "@/components/ui/button";
import { ChecklistDialog } from "@/components/ui/checklist-dialog";
import { FieldGroup } from "@/components/ui/field-group";
import { AlertIcon } from "@/components/ui/icons";
import { MoneyField } from "@/components/ui/money-field";
import { PersonChip } from "@/components/ui/person-chip";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TextField } from "@/components/ui/text-field";
import {
  addPersonError,
  byRecent,
  checkDraft,
  type Draft,
  draftFromSeries,
  findPeople,
  isRecurring,
  NEW_PERSON,
  nameOf,
  newDraft,
  pickerIds,
  type Preset,
  type RecentGroup,
  recentGroups,
  saveDraft,
  savedPersonNamed,
  splitsByItem,
  tickPeople,
  untickPeople,
} from "@/lib/bill-draft";
import { formatDate, todayIso } from "@/lib/dates";
import { createId } from "@/lib/id";
import { type AppData, ME } from "@/lib/model";
import { DEFAULT_CURRENCY, formatMoney, toInputAmount } from "@/lib/money";
import { byName, listNames } from "@/lib/people";
import { recurringStatuses } from "@/lib/recurring";
import { itemsThatFit } from "@/lib/rows";
import { updateData } from "@/lib/store";
import { LoadingShell } from "@/components/loading-shell";
import { ItemsField } from "./items-field";
import { ShareSummary } from "./share-summary";

// The first field with a problem; in a group, its first box, tick or "choose people" button.
const FIRST_INVALID = '[aria-invalid="true"], [data-invalid] input, [data-invalid] button[aria-haspopup]';

type BillFormProps = {
  preset: Preset;
  data: AppData;
  /** Fill the form in from this recurring series, for its next bill ("Add Nov 1"). */
  seriesId?: string;
  onSaved: () => void;
};

export function BillForm({ preset, data, seriesId, onSaved }: BillFormProps) {
  const router = useRouter();
  const people = data.people;
  // Ids unique to this form: Next keeps visited pages alive (hidden), so a fixed id
  // like "total" could exist twice and point labels and errors at the hidden copy.
  const uid = useId();
  const ids = { addPerson: `${uid}add-person`, total: `${uid}total`, addItem: `${uid}add-item` };
  const byId = (id: string) => `[id="${id}"]`;
  const [draft, setDraft] = useState(() => {
    const today = todayIso();
    const next = seriesId ? recurringStatuses(data, today).find((s) => s.series.id === seriesId) : undefined;
    return next ? draftFromSeries(next.series, next.nextDue, people, createId) : newDraft(preset, today, createId);
  });
  const [submitted, setSubmitted] = useState(false);
  // After Save: show the loading screen, then the new bill. The form is reset only once
  // this page is hidden (Next keeps it alive in the background), so it's never seen clearing.
  const [saved, setSaved] = useState(false);
  const savedRef = useRef(false);
  useEffect(() => {
    return () => {
      if (savedRef.current) onSaved();
    };
  }, [onSaved]);
  const [addError, setAddError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  // Read out when Save finds problems: how many, and that focus is on the first.
  const [saveProblems, setSaveProblems] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const showAllRef = useRef<HTMLButtonElement>(null);
  const [showGroups, setShowGroups] = useState(false);
  const showGroupsRef = useRef<HTMLButtonElement>(null);
  // A filled-in recurring bill only needs this time's amount, so start there.
  const [focusRequest, setFocusRequest] = useState<{ selector: string } | null>(() =>
    draft.seriesId ? { selector: byId(ids.total) } : null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const chipRowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Who was there shows as many recent people as fit in two rows. Each chip is measured
  // ticked (its widest, with the check mark), so ticking never pushes one to a third row.
  // Measured before the first paint, and again if the screen's width changes.
  useLayoutEffect(() => {
    const row = chipRowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;
    const fit = () => {
      if (row.clientWidth === 0) return; // the page is hidden (Next keeps visited pages alive)
      const widths = [...measure.children].map((chip) => chip.getBoundingClientRect().width);
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      // The first chip is Me; the rest are the recent people that fit beside it.
      const recentChips = Math.max(itemsThatFit(widths, row.clientWidth, gap, 2) - 1, 0);
      setDraft((current) => (current.recentChips === recentChips ? current : { ...current, recentChips }));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(row);
    observer.observe(measure);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (focusRequest) formRef.current?.querySelector<HTMLElement>(focusRequest.selector)?.focus();
  }, [focusRequest]);

  const requestFocus = (selector: string) => setFocusRequest({ selector });
  const update = (change: Partial<Draft>) => setDraft((current) => ({ ...current, ...change }));
  const name = (id: string) => nameOf(id, draft, people);

  // Errors only show after the first Save, then update as fields are fixed.
  const check = checkDraft(draft, people);
  const errors = submitted ? check.errors : {};
  const recurring = isRecurring(draft);
  const peopleLegend = recurring ? "Who's splitting it" : "Who was there";
  const byItem = splitsByItem(draft);
  const chips = pickerIds(draft, people);
  const matches = findPeople(draft.pendingName, draft, people);
  const groups = recentGroups(data);
  const payerOptions = [
    ME,
    ...draft.ticked.filter((id) => id !== ME),
    ...(draft.payerId !== ME && !draft.ticked.includes(draft.payerId) ? [draft.payerId] : []),
  ];

  // Unticking someone takes them off every item too.
  function setTicked(id: string, on: boolean) {
    setDraft((current) => (on ? tickPeople(current, people, [id]) : untickPeople(current, people, [id])));
  }

  /** A suggestion picked in "Find or add a person": someone saved, or the typed name as someone new. */
  function pickPerson(id: string): void {
    if (id === NEW_PERSON) return addPerson();
    setDraft((current) => ({ ...tickPeople(current, people, [id]), pendingName: "" }));
    setAddError(null);
    setAnnouncement(`${name(id)} added to this bill.`);
    requestFocus(byId(ids.addPerson)); // ready for the next name
  }

  /** A recent group ("Fam Dinner"): ticking puts them all on the bill, unticking takes them all off. */
  function setGroup(group: RecentGroup, on: boolean) {
    setDraft((current) => (on ? tickPeople(current, people, group.ids) : untickPeople(current, people, group.ids)));
    setAnnouncement(
      on
        ? `Added the ${group.ids.length} people from ${group.title}.`
        : `Took the ${group.ids.length} people from ${group.title} off this bill.`,
    );
  }

  function addPerson(): void {
    // A name that's already saved puts that person on the bill, rather than a second one.
    const existing = savedPersonNamed(draft.pendingName, draft, people);
    if (existing) return pickPerson(existing);
    const error = addPersonError(draft.pendingName, draft, people);
    if (error) {
      setAddError(error);
      setAnnouncement(error);
      requestFocus(byId(ids.addPerson));
      return;
    }
    const person = { id: createId(), name: draft.pendingName.trim() };
    setDraft((current) => tickPeople({ ...current, added: [...current.added, person], pendingName: "" }, people, [person.id]));
    setAddError(null);
    setAnnouncement(`${person.name} added to this bill.`);
    requestFocus(byId(ids.addPerson)); // ready for the next name
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setAddError(null);
    const problems = Object.keys(check.errors).length;
    if (problems > 0) {
      setSaveError(null);
      const message = `Couldn't save yet: ${problems} ${problems === 1 ? "thing needs" : "things need"} fixing. Moved to the first one.`;
      // A trailing space alternates so pressing Save again re-announces the same message.
      setSaveProblems((previous) => (previous === message ? message + " " : message));
      requestFocus(FIRST_INVALID);
      return;
    }

    let billId = "";
    const result = updateData((data) => {
      const saved = saveDraft(data, draft, new Date(), createId);
      billId = saved.billId;
      return saved.data;
    });
    if (!result.ok) {
      setSaveError("Couldn't save on this phone. Everything you typed is still here. Try again.");
      return;
    }
    // No "Saved" message: the loading screen, then the bill itself, is the confirmation.
    savedRef.current = true;
    setSaved(true);
    // Long enough to read the loading screen as a step, not a flicker.
    setTimeout(() => router.push(`/bills/${billId}`), 500);
  }

  if (saved) return <LoadingShell />;

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="space-y-6">
      <TextField
        label="Name"
        placeholder={recurring ? "e.g. Netflix" : "e.g. Dinner at Aba"}
        value={draft.title}
        onChange={(event) => update({ title: event.target.value })}
        error={errors.title}
        autoComplete="off"
      />
      <TextField
        type="date"
        label={recurring ? "Date of this bill" : "Date"}
        value={draft.date}
        onChange={(event) => update({ date: event.target.value })}
        error={errors.date}
      />

      {/* Me and two rows of the most recent people as chips, then anyone found, added or
          picked. With lots of saved people, the rest are a search, a recent group, or Show all away. */}
      <FieldGroup legend={peopleLegend}>
        {/* Invisible copies of the chips, ticked and on one line, for measuring how many fit in
            two rows. At the end of <body>, so they're never mistaken for the real chips. */}
        {createPortal(
          <div
            ref={measureRef}
            aria-hidden="true"
            inert
            className="invisible fixed top-0 left-0 flex h-0 w-max gap-2 overflow-hidden whitespace-nowrap"
          >
            {[ME, ...byRecent(people).slice(0, 40).map((person) => person.id)].map((id) => (
              <PersonChip key={id} label={name(id)} checked onChange={() => {}} tabIndex={-1} />
            ))}
          </div>,
          document.body,
        )}
        <div ref={chipRowRef} className="flex flex-wrap gap-2">
          {chips.map((id) => (
            <PersonChip
              key={id}
              label={name(id)}
              checked={draft.ticked.includes(id)}
              onChange={(on) => setTicked(id, on)}
            />
          ))}
        </div>
        <div className="mt-3">
          <AddField
            id={ids.addPerson}
            label="Find or add a person"
            buttonLabel="Add person"
            placeholder="Find or add a name"
            suggestions={matches}
            onPick={pickPerson}
            value={draft.pendingName}
            onChange={(event) => {
              update({ pendingName: event.target.value });
              setAddError(null);
            }}
            onAdd={addPerson}
            error={addError ?? errors.people}
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="done"
            maxLength={40}
          />
        </div>
        {(groups.length > 0 || people.length > draft.recentChips) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {groups.length > 0 && (
              <Button ref={showGroupsRef} variant="secondary" aria-haspopup="dialog" onClick={() => setShowGroups(true)}>
                Show groups
              </Button>
            )}
            {people.length > draft.recentChips && (
              <Button ref={showAllRef} variant="secondary" aria-haspopup="dialog" onClick={() => setShowAll(true)}>
                Show all
              </Button>
            )}
          </div>
        )}
        <p role="status" className="sr-only">
          {announcement}
        </p>
      </FieldGroup>
      {showGroups && (
        <ChecklistDialog
          title="Recent groups"
          description={null}
          findable={false}
          options={groups.map((group) => ({
            id: group.id,
            label: group.title,
            detail: `${formatDate(group.date)} · ${listNames(group.ids.map(name))}`,
          }))}
          selected={groups.filter((group) => group.ids.every((id) => draft.ticked.includes(id))).map((group) => group.id)}
          onToggle={(id, on) => {
            const group = groups.find((g) => g.id === id);
            if (group) setGroup(group, on);
          }}
          onClose={() => {
            setShowGroups(false);
            showGroupsRef.current?.focus();
          }}
        />
      )}
      {showAll && (
        <ChecklistDialog
          title={peopleLegend}
          options={[
            { id: ME, label: "Me" },
            ...[...draft.added, ...people].sort(byName).map((person) => ({ id: person.id, label: person.name })),
          ]}
          selected={draft.ticked}
          onToggle={setTicked}
          onClose={() => {
            setShowAll(false);
            showAllRef.current?.focus();
          }}
        />
      )}

      <FieldGroup legend="Who paid" error={errors.payer}>
        <div className="flex flex-wrap gap-2">
          {payerOptions.map((id) => (
            <PersonChip
              key={id}
              type="radio"
              name="payer"
              label={name(id)}
              checked={draft.payerId === id}
              onChange={() => update({ payerId: id })}
            />
          ))}
        </div>
      </FieldGroup>

      {!recurring && (
        <SegmentedControl
          legend="How to split"
          name="split"
          value={draft.split}
          onChange={(split) => update({ split })}
          options={[
            { value: "items", label: "By item" },
            { value: "even", label: "Evenly" },
          ]}
        />
      )}

      {byItem && (
        <ItemsField
          draft={draft}
          people={people}
          errors={errors}
          setDraft={setDraft}
          requestFocus={requestFocus}
          addItemId={ids.addItem}
        />
      )}

      <MoneyField
        id={ids.total}
        label={byItem ? "Total paid, including tax and tip" : "Amount"}
        hint={byItem ? "The amount on your card slip, after tip" : undefined}
        currency={DEFAULT_CURRENCY}
        value={draft.total}
        onChange={(event) => update({ total: event.target.value })}
        error={errors.total}
      />
      {byItem && draft.receipt?.total !== undefined && (
        <div className="-mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="type-small text-ink-muted">
            Receipt total {formatMoney(draft.receipt.total, DEFAULT_CURRENCY)}. Add any extra tip you left.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              update({ total: toInputAmount(draft.receipt!.total!, DEFAULT_CURRENCY) });
              requestFocus(byId(ids.total));
            }}
          >
            Use this<span className="sr-only"> receipt total</span>
          </Button>
        </div>
      )}

      {recurring && (
        <SegmentedControl
          legend="Repeats"
          name="repeats"
          value={draft.repeats}
          onChange={(repeats) => update({ repeats })}
          options={[
            { value: "week", label: "Weekly" },
            { value: "two-weeks", label: "Every 2 weeks" },
            { value: "month", label: "Monthly" },
            { value: "custom", label: "Custom" },
          ]}
        >
          {/* Custom's interval is one line in a light-blue panel inside Repeats, so it reads as
              part of Custom: Every [ 3 ] [Weeks] [Months]. */}
          {draft.repeats === "custom" && (
            <div className="mt-3 rounded-field border border-selected-border bg-accent-soft p-2">
              <TextField
                inline
                label="Every"
                inputMode="numeric"
                maxLength={2}
                value={draft.every}
                onChange={(event) => update({ every: event.target.value })}
                error={errors.every}
                after={
                  <SegmentedControl
                    legend="Weeks or months"
                    hideLegend
                    name="unit"
                    value={draft.unit}
                    onChange={(unit) => update({ unit })}
                    options={[
                      { value: "week", label: "Weeks" },
                      { value: "month", label: "Months" },
                    ]}
                  />
                }
              />
            </div>
          )}
        </SegmentedControl>
      )}

      <ShareSummary draft={draft} people={people} warnings={check.warnings} />

      <div>
        {saveError && (
          <p role="alert" className="mb-3 flex items-start gap-2 type-small font-semibold text-danger">
            <AlertIcon className="mt-0.5 size-4 shrink-0" />
            {saveError}
          </p>
        )}
        <p role="alert" className="sr-only">
          {saveProblems}
        </p>
        <Button type="submit" fullWidth>
          Save bill
        </Button>
      </div>
    </form>
  );
}
