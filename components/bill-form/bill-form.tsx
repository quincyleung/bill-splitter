"use client";

// The one form behind both quick starts. One-time opens on "Evenly" (the shortest
// form) with "By item" one tap away; Recurring is a monthly, even split. One column; errors appear
// next to their field after Save, and nothing typed is ever cleared.

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { AddField } from "@/components/ui/add-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field-group";
import { AlertIcon } from "@/components/ui/icons";
import { MoneyField } from "@/components/ui/money-field";
import { PersonChip } from "@/components/ui/person-chip";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TextField } from "@/components/ui/text-field";
import {
  addPersonError,
  checkDraft,
  type Draft,
  draftFromSeries,
  isRecurring,
  nameOf,
  newDraft,
  pickerIds,
  type Preset,
  saveDraft,
  splitsByItem,
} from "@/lib/bill-draft";
import { todayIso } from "@/lib/dates";
import { createId } from "@/lib/id";
import { type AppData, ME } from "@/lib/model";
import { DEFAULT_CURRENCY, formatMoney, toInputAmount } from "@/lib/money";
import { recurringStatuses } from "@/lib/recurring";
import { updateData } from "@/lib/store";
import { LoadingShell } from "@/components/loading-shell";
import { ItemsField } from "./items-field";
import { ShareSummary } from "./share-summary";

const FIRST_INVALID = '[aria-invalid="true"], [data-invalid] input';

/** Examples shown inside the Name box until you type (the label above stays the real label). */
const TITLE_EXAMPLES: Record<Preset, string> = {
  "one-time": "Dinner at Aba",
  recurring: "Electricity",
};

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
  const [saveError, setSaveError] = useState<string | null>(null);
  // A filled-in recurring bill only needs this time's amount, so start there.
  const [focusRequest, setFocusRequest] = useState<{ selector: string } | null>(() =>
    draft.seriesId ? { selector: byId(ids.total) } : null,
  );
  const formRef = useRef<HTMLFormElement>(null);

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
  const byItem = splitsByItem(draft);
  const chips = pickerIds(draft, people);
  const payerOptions = [
    ME,
    ...draft.ticked.filter((id) => id !== ME),
    ...(draft.payerId !== ME && !draft.ticked.includes(draft.payerId) ? [draft.payerId] : []),
  ];

  function setTicked(id: string, on: boolean) {
    setDraft((current) => {
      const ticked = on ? [...current.ticked, id] : current.ticked.filter((t) => t !== id);
      return {
        ...current,
        ticked: pickerIds(current, people).filter((t) => ticked.includes(t)),
        // Unticking someone takes them off every item.
        items: on ? current.items : current.items.map((item) => ({ ...item, personIds: item.personIds.filter((p) => p !== id) })),
      };
    });
  }

  function addPerson() {
    const error = addPersonError(draft.pendingName, draft, people);
    if (error) {
      setAddError(error);
      requestFocus(byId(ids.addPerson));
      return;
    }
    const person = { id: createId(), name: draft.pendingName.trim() };
    setDraft((current) => {
      const next = { ...current, added: [...current.added, person], pendingName: "" };
      return { ...next, ticked: pickerIds(next, people).filter((t) => t === person.id || current.ticked.includes(t)) };
    });
    setAddError(null);
    setAnnouncement(`${person.name} added to this bill.`);
    requestFocus(byId(ids.addPerson)); // ready for the next name
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setAddError(null);
    if (Object.keys(check.errors).length > 0) {
      setSaveError(null);
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
        placeholder={TITLE_EXAMPLES[preset]}
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

      <FieldGroup legend={recurring ? "Who's splitting it" : "Who was there"} hint="New names are saved for next time.">
        <div className="flex flex-wrap gap-2">
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
            buttonLabel="Add person"
            placeholder="Name"
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
        <p role="status" className="sr-only">
          {announcement}
        </p>
      </FieldGroup>

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
        <>
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
          />
          {draft.repeats === "custom" && (
            <>
              <TextField
                label="Repeat every"
                hint={draft.unit === "week" ? "1 to 52 weeks" : "1 to 12 months"}
                inputMode="numeric"
                value={draft.every}
                onChange={(event) => update({ every: event.target.value })}
                error={errors.every}
              />
              <SegmentedControl
                legend="Weeks or months"
                name="unit"
                value={draft.unit}
                onChange={(unit) => update({ unit })}
                options={[
                  { value: "week", label: "Weeks" },
                  { value: "month", label: "Months" },
                ]}
              />
            </>
          )}
        </>
      )}

      <ShareSummary draft={draft} people={people} warnings={check.warnings} />

      <div>
        {saveError && (
          <p role="alert" className="mb-3 flex items-start gap-2 type-small font-semibold text-danger">
            <AlertIcon className="mt-0.5 size-4 shrink-0" />
            {saveError}
          </p>
        )}
        <Button type="submit" fullWidth>
          Save bill
        </Button>
      </div>
    </form>
  );
}
