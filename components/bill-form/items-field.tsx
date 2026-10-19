"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { MoneyField } from "@/components/ui/money-field";
import { PersonChip } from "@/components/ui/person-chip";
import { TextField } from "@/components/ui/text-field";
import { type Draft, type DraftItem, type Errors, errorKey, nameOf, newItem } from "@/lib/bill-draft";
import { createId } from "@/lib/id";
import type { Person } from "@/lib/model";
import { DEFAULT_CURRENCY } from "@/lib/money";

type ItemsFieldProps = {
  draft: Draft;
  people: Person[];
  errors: Errors;
  setDraft: Dispatch<SetStateAction<Draft>>;
  requestFocus: (selector: string) => void;
};

/** Typed-in items: a name, a price, and who had it. A shared item is split evenly. */
export function ItemsField({ draft, people, errors, setDraft, requestFocus }: ItemsFieldProps) {
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

  function removeItem(key: string) {
    setDraft((current) => ({ ...current, items: current.items.filter((item) => item.key !== key) }));
    requestFocus("#add-item");
  }

  return (
    <FieldGroup legend="Items" error={errors.items}>
      <ol className="space-y-3">
        {draft.items.map((item, index) => {
          const everyone = draft.ticked.length > 0 && draft.ticked.every((id) => item.personIds.includes(id));
          return (
            <li key={item.key}>
              <Card>
                <FieldGroup legend={`Item ${index + 1}`}>
                  <div className="space-y-4">
                    <TextField
                      id={`name-${item.key}`}
                      label="Name"
                      hint="Like Burger"
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
                        <p className="text-base text-ink-muted">Tick people under Who was there first.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {draft.ticked.map((id) => (
                            <PersonChip
                              key={id}
                              label={nameOf(id, draft, people)}
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
                    {draft.items.length > 1 && (
                      <Button variant="secondary" onClick={() => removeItem(item.key)}>
                        Remove item {index + 1}
                      </Button>
                    )}
                  </div>
                </FieldGroup>
              </Card>
            </li>
          );
        })}
      </ol>
      <div className="mt-3">
        <Button id="add-item" variant="secondary" onClick={addItem}>
          Add item
        </Button>
      </div>
    </FieldGroup>
  );
}
