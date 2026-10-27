"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { updatePreferences } from "@/actions/preferences";
import {
  allergyOptions,
  commonDislikes,
  cookingDayOptions,
  dietOptions,
  moodOptions,
  proteinsForDiet,
  timeValues,
} from "@/config/preferences";
import { formatTimeZone } from "@/lib/preferences/timezone";
import type { PreferenceValues } from "@/lib/validation/preferences";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChoiceGrid } from "./choice-grid";

function browserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function SettingsPreferencesForm({
  initialValues,
}: {
  initialValues: PreferenceValues;
}) {
  const [values, setValues] = useState(initialValues);
  const [dislike, setDislike] = useState("");
  const [pending, startTransition] = useTransition();

  function update<K extends keyof PreferenceValues>(
    key: K,
    value: PreferenceValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleList(
    key: "mood_tags" | "cooking_days" | "allergies" | "protein_likes",
    value: string | number,
    max?: number,
  ) {
    const selected = values[key] as (string | number)[];
    const exists = selected.includes(value);
    if (!exists && max && selected.length >= max) return;
    setValues(
      (current) =>
        ({
          ...current,
          [key]: exists
            ? selected.filter((item) => item !== value)
            : [...selected, value],
        }) as PreferenceValues,
    );
  }

  function chooseDiet(diet: PreferenceValues["diet"]) {
    const compatible = new Set(
      proteinsForDiet(diet).map((option) => option.value),
    );
    update("diet", diet);
    update(
      "protein_likes",
      values.protein_likes.filter((protein) => compatible.has(protein)),
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updatePreferences(values);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Preferences saved.");
    });
  }

  function toggleDislike(dislike: string) {
    const exists = values.dislikes.some(
      (item) => item.toLowerCase() === dislike.toLowerCase(),
    );
    update(
      "dislikes",
      exists
        ? values.dislikes.filter(
            (item) => item.toLowerCase() !== dislike.toLowerCase(),
          )
        : [...values.dislikes, dislike],
    );
  }

  function addDislike(value = dislike) {
    const normalized = value.trim().replace(/\s+/g, " ");
    if (
      !normalized ||
      values.dislikes.some(
        (item) => item.toLowerCase() === normalized.toLowerCase(),
      )
    ) {
      setDislike("");
      return;
    }
    update("dislikes", [...values.dislikes, normalized]);
    setDislike("");
  }

  return (
    <form onSubmit={submit} className="space-y-10">
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Your dinner style</h2>
          <p className="text-muted-foreground text-sm">
            Pick up to three moods for the week.
          </p>
        </div>
        <ChoiceGrid
          choices={moodOptions}
          selected={values.mood_tags}
          onToggle={(value) => toggleList("mood_tags", value, 3)}
        />
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Cooking days</h2>
          <p className="text-muted-foreground text-sm">
            Choose when to plan dinner.
          </p>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {cookingDayOptions.map((day) => (
            <button
              key={day.value}
              type="button"
              aria-pressed={values.cooking_days.includes(day.value)}
              onClick={() => toggleList("cooking_days", day.value)}
              className="border-border bg-card focus-visible:ring-ring aria-pressed:border-primary aria-pressed:bg-accent min-h-12 rounded-xl border-2 text-sm font-bold focus-visible:ring-3 focus-visible:outline-none"
            >
              {day.label.slice(0, 1)}
              <span className="sr-only">{day.label}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Household</h2>
          <p className="text-muted-foreground text-sm">
            We’ll scale ingredients for everyone at the table.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            aria-label="Decrease household size"
            disabled={values.household_size === 1}
            onClick={() => update("household_size", values.household_size - 1)}
          >
            <Minus />
          </Button>
          <p className="min-w-20 text-center text-3xl font-bold">
            {values.household_size}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            aria-label="Increase household size"
            disabled={values.household_size === 6}
            onClick={() => update("household_size", values.household_size + 1)}
          >
            <Plus />
          </Button>
          <button
            type="button"
            aria-pressed={values.has_kids}
            onClick={() => update("has_kids", !values.has_kids)}
            className="border-border bg-card aria-pressed:border-primary aria-pressed:bg-accent ml-auto min-h-11 rounded-xl border px-3 text-sm font-semibold"
          >
            Kids included
          </button>
        </div>
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Diet and allergies</h2>
          <p className="text-muted-foreground text-sm">
            We’ll treat these as hard rules.
          </p>
        </div>
        <ChoiceGrid
          choices={dietOptions}
          selected={[values.diet]}
          multiple={false}
          onToggle={(value) => chooseDiet(value as PreferenceValues["diet"])}
        />
        <div className="space-y-3">
          <button
            type="button"
            aria-pressed={values.allergies.length === 0}
            onClick={() => update("allergies", [])}
            className="border-border bg-card aria-pressed:border-primary aria-pressed:bg-accent min-h-11 w-full rounded-xl border px-3 text-left text-sm font-semibold"
          >
            No allergies to plan around
          </button>
          <ChoiceGrid
            choices={allergyOptions}
            selected={values.allergies}
            onToggle={(value) => toggleList("allergies", value)}
          />
        </div>
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Proteins you enjoy</h2>
          <p className="text-muted-foreground text-sm">
            Only choices that fit your dietary needs are shown.
          </p>
        </div>
        <ChoiceGrid
          choices={proteinsForDiet(values.diet)}
          selected={values.protein_likes}
          onToggle={(value) => toggleList("protein_likes", value)}
        />
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Dislikes</h2>
          <p className="text-muted-foreground text-sm">
            Tap any common pick you’d like us to avoid.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={dislike}
            onChange={(event) => setDislike(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addDislike();
              }
            }}
            placeholder="Add something else"
            aria-label="Add a dislike"
            name="dislike"
            autoComplete="off"
            className="h-12"
          />
          <Button
            type="button"
            size="icon-lg"
            aria-label="Add dislike"
            onClick={() => addDislike()}
          >
            <Plus />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {values.dislikes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                update(
                  "dislikes",
                  values.dislikes.filter((dislikeItem) => dislikeItem !== item),
                )
              }
              className="border-primary bg-accent focus-visible:ring-ring flex min-h-10 items-center gap-1 rounded-full border px-3 text-sm font-medium focus-visible:ring-3 focus-visible:outline-none"
            >
              {item}
              <X className="size-3" aria-hidden="true" />
              <span className="sr-only">Remove {item}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {commonDislikes.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={values.dislikes.some(
                (dislike) => dislike.toLowerCase() === item.toLowerCase(),
              )}
              onClick={() => toggleDislike(item)}
              className="border-border bg-card aria-pressed:border-primary aria-pressed:bg-accent min-h-10 rounded-full border px-3 text-sm font-medium"
            >
              {item}
            </button>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Time to cook</h2>
          <p className="text-muted-foreground text-sm">
            Keep plans realistic for your week.
          </p>
        </div>
        {(["max_minutes_weekday", "max_minutes_weekend"] as const).map(
          (field) => (
            <div
              key={field}
              className="grid grid-cols-[auto_1fr] items-center gap-4"
            >
              <span className="text-sm font-semibold">
                {field === "max_minutes_weekday" ? "Weeknights" : "Weekends"}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {timeValues.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    aria-pressed={values[field] === minutes}
                    onClick={() => update(field, minutes)}
                    className="border-border bg-card aria-pressed:border-primary aria-pressed:bg-accent min-h-11 rounded-xl border text-sm font-semibold"
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
            </div>
          ),
        )}
      </section>
      <section className="border-border bg-card space-y-3 rounded-2xl border p-5">
        <div>
          <h2 className="text-xl font-bold">Time zone</h2>
          <p className="text-muted-foreground text-sm">
            {formatTimeZone(values.timezone)}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => update("timezone", browserTimeZone())}
        >
          Use this device’s timezone
        </Button>
      </section>
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="min-h-12 w-full rounded-full text-base font-bold"
      >
        {pending ? "Saving…" : "Save preferences"}
      </Button>
    </form>
  );
}
