"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChecklistDialog } from "@/components/ui/checklist-dialog";
import { FieldGroup } from "@/components/ui/field-group";
import { IconButton } from "@/components/ui/icon-button";
import { TrashIcon } from "@/components/ui/icons";
import { MoneyField } from "@/components/ui/money-field";
import { PersonChip } from "@/components/ui/person-chip";
import { TextField } from "@/components/ui/text-field";
import { type Draft, type DraftItem, type Errors, errorKey, itemTitle, nameOf, newItem } from "@/lib/bill-draft";
import { createId } from "@/lib/id";
import { ME, type Person } from "@/lib/model";
import { DEFAULT_CURRENCY, formatMoney, parseMoney } from "@/lib/money";
import { ReceiptPaste } from "./receipt-paste";

type ItemsFieldProps = {
  draft: Draft;
  people: Person[];
  errors: Errors;
  setDraft: Dispatch<SetStateAction<Draft>>;
  requestFocus: (selector: string) => void;
  /** Unique to this form, so focus can return to "Add item" after a removal. */
  addItemId: string;
};

/** Past this many people on the bill, each item's "Who had it" is one button that opens a pop-up list. */
const COMPACT_OVER = 8;

/** Typed-in items: a name, a price, and who had it. A shared item is split evenly. */
export function ItemsField({ draft, people, errors, setDraft, requestFocus, addItemId }: ItemsFieldProps) {
  // The item whose "Who had it" pop-up is open.
  const [picking, setPicking] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const compact = draft.ticked.length > COMPACT_OVER;
  const name = (id: string) => nameOf(id, draft, people);
  // In the pop-up: Me first, then A to Z.
  const pickOptions = [
    ...draft.ticked.filter((id) => id === ME),
    ...draft.ticked.filter((id) => id !== ME).sort((a, b) => name(a).localeCompare(name(b), undefined, { sensitivity: "base" })),
  ].map((id) => ({ id, label: name(id) }));

  /** "Sam, Jo + 3", "Everyone", or "Choose who had it". */
  function whoSummary(item: DraftItem) {
    const had = draft.ticked.filter((id) => item.personIds.includes(id));
    if (had.length === 0) return "Choose who had it";
    if (had.length === draft.ticked.length) return "Everyone";
    const names = had.slice(0, 2).map(name).join(", ");
    return had.length > 2 ? `${names} + ${had.length - 2}` : names;
  }

  const updateItem = (key: string, change: Partial<DraftItem>) =>
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => (item.key === key ? { ...item, ...change } : item)),
    }));

  function addItem() {
    const item = newItem(createId);
    setDraft((current) => ({ ...current, items: [...current.items, item] }));
    requestFocus(`#name-${item.key}`);
  }

  function removeItem(key: string, title: string) {
    setDraft((current) => ({ ...current, items: current.items.filter((item) => item.key !== key) }));
    setAnnouncement(`${title} deleted.`);
    requestFocus(`[id="${addItemId}"]`);
  }

  return (
    <FieldGroup legend="Items" error={errors.items}>
      <ReceiptPaste draft={draft} setDraft={setDraft} requestFocus={requestFocus} />
      <ol className="space-y-3">
        {draft.items.map((item, index) => {
          const everyone = draft.ticked.length > 0 && draft.ticked.every((id) => item.personIds.includes(id));
          const linePrice = parseMoney(item.price, DEFAULT_CURRENCY);
          const perPerson = item.quantity && item.quantity > 1 && linePrice ? linePrice / item.quantity : null;
          return (
            <li key={item.key}>
              <Card>
                {/* A trash can in the card's corner, beside the title: one tap deletes the item.
                    Before the fields, so it's first in the tab order too. */}
                {draft.items.length > 1 && (
                  <div className="absolute top-3 right-2.5">
                    <IconButton
                      label={item.name.trim() ? `Delete ${item.name.trim()}` : `Delete item ${index + 1}`}
                      icon={<TrashIcon />}
                      onClick={() => removeItem(item.key, itemTitle(item, index))}
                    />
                  </div>
                )}
                {/* Titled by the item's name once it has one ("Salmon"), so the cards can be scanned. */}
                <FieldGroup legend={itemTitle(item, index)} size="title">
                  <div className="space-y-4">
                    {perPerson !== null && (
                      <p className="type-small text-ink-muted">
                        {item.quantity} × {formatMoney(Math.round(perPerson), DEFAULT_CURRENCY)} on the receipt: tick{" "}
                        {item.quantity} people
                      </p>
                    )}
                    <TextField
                      id={`name-${item.key}`}
                      label="Name"
                      value={item.name}
                      onChange={(event) => updateItem(item.key, { name: event.target.value })}
                      error={errors[errorKey.name(item.key)]}
                      autoComplete="off"
                    />
                    <MoneyField
                      id={`price-${item.key}`}
                      label="Price"
                      currency={DEFAULT_CURRENCY}
                      value={item.price}
                      onChange={(event) => updateItem(item.key, { price: event.target.value })}
                      error={errors[errorKey.price(item.key)]}
                    />
                    <FieldGroup legend="Who had it" error={errors[errorKey.who(item.key)]}>
                      {draft.ticked.length === 0 ? (
                        <p className="text-ink-muted">Tick people under Who was there first.</p>
                      ) : compact ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            id={`who-${item.key}`}
                            variant="secondary"
                            aria-haspopup="dialog"
                            onClick={() => setPicking(item.key)}
                          >
                            {whoSummary(item)}
                            {item.personIds.length > 0 && (
                              <>
                                <span aria-hidden="true" className="text-ink-muted">
                                  ·
                                </span>
                                Change
                              </>
                            )}
                          </Button>
                          <PersonChip
                            label="Everyone"
                            checked={everyone}
                            onChange={(on) => updateItem(item.key, { personIds: on ? [...draft.ticked] : [] })}
                          />
                          {picking === item.key && (
                            <ChecklistDialog
                              title={`Who had ${item.name.trim() || "this item"}`}
                              options={pickOptions}
                              selected={item.personIds}
                              onToggle={(id, on) =>
                                setDraft((current) => ({
                                  ...current,
                                  items: current.items.map((i) =>
                                    i.key === item.key
                                      ? { ...i, personIds: on ? [...i.personIds, id] : i.personIds.filter((p) => p !== id) }
                                      : i,
                                  ),
                                }))
                              }
                              allLabel="Everyone"
                              onAll={(on) => updateItem(item.key, { personIds: on ? [...draft.ticked] : [] })}
                              onClose={() => {
                                setPicking(null);
                                document.getElementById(`who-${item.key}`)?.focus();
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {draft.ticked.map((id) => (
                            <PersonChip
                              key={id}
                              label={name(id)}
                              checked={item.personIds.includes(id)}
                              onChange={(on) =>
                                updateItem(item.key, {
                                  personIds: on ? [...item.personIds, id] : item.personIds.filter((p) => p !== id),
                                })
                              }
                            />
                          ))}
                          {draft.ticked.length > 1 && (
                            <PersonChip
                              label="Everyone"
                              checked={everyone}
                              onChange={(on) => updateItem(item.key, { personIds: on ? [...draft.ticked] : [] })}
                            />
                          )}
                        </div>
                      )}
                    </FieldGroup>
                  </div>
                </FieldGroup>
              </Card>
            </li>
          );
        })}
      </ol>
      <div className="mt-3">
        <Button id={addItemId} variant="secondary" onClick={addItem}>
          Add item
        </Button>
      </div>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </FieldGroup>
  );
}
