"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Minus, Plus, X } from "lucide-react";
import { completeOnboarding } from "@/actions/preferences";
import {
  allergyOptions,
  commonDislikes,
  cookingDayOptions,
  dietOptions,
  moodOptions,
  proteinsForDiet,
  timeValues,
} from "@/config/preferences";
import { buildSummarySentence } from "@/lib/preferences/summary";
import type { PreferenceValues } from "@/lib/validation/preferences";
import { ChoiceGrid } from "./choice-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const steps = [
  { title: "What are you in the mood for?", helper: "Pick up to 3" },
  {
    title: "Which days will you be cooking?",
    helper: "Choose the nights you want us to plan",
  },
  {
    title: "Who are you feeding?",
    helper: "We’ll scale each dinner for your household",
  },
  { title: "Any dietary needs?", helper: "Pick one" },
  { title: "Any allergies?", helper: "Select all that apply" },
  { title: "What proteins do you enjoy?", helper: "Choose at least one" },
  {
    title: "Anything you’d rather skip?",
    helper: "We’ll keep it out of your suggestions",
  },
  {
    title: "How much time feels right?",
    helper: "Choose a weeknight and weekend pace",
  },
] as const;

function browserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function OnboardingFlow({
  initialValues,
}: {
  initialValues: PreferenceValues;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<PreferenceValues>({
    ...initialValues,
    timezone: browserTimeZone(),
  });
  const [dislike, setDislike] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const summary = useMemo(() => buildSummarySentence(values), [values]);
  const isSummary = step === steps.length;

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

  function continueFlow() {
    setError("");
    if (step === 0 && values.mood_tags.length === 0)
      return setError("Choose at least one mood.");
    if (step === 1 && values.cooking_days.length === 0)
      return setError("Choose at least one cooking day.");
    if (step === 5 && values.protein_likes.length === 0)
      return setError("Choose at least one protein.");
    setStep((current) => current + 1);
  }

  function save() {
    setError("");
    startTransition(async () => {
      const result = await completeOnboarding({
        ...values,
        timezone: browserTimeZone(),
      });
      if (!result.ok) return setError(result.error);
      router.replace("/plan");
      router.refresh();
    });
  }

  const content = isSummary ? (
    <div className="animate-in fade-in-0 zoom-in-95 space-y-6 duration-300 motion-reduce:animate-none">
      <div
        className="bg-secondary mx-auto grid size-16 place-items-center rounded-full text-3xl"
        aria-hidden="true"
      >
        🎉
      </div>
      <div className="space-y-3 text-center">
        <p className="text-foreground text-sm font-bold tracking-[0.16em] uppercase">
          All set
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-balance">
          Your plan is ready to build
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md text-pretty">
          {summary}
        </p>
      </div>
      <div className="border-border bg-card space-y-3 rounded-2xl border p-5 text-left">
        <p className="text-sm font-semibold">Your answers</p>
        <p className="text-muted-foreground text-sm">
          {values.cooking_days.length} dinners · {values.household_size} people
          · {values.max_minutes_weekday}-minute weeknights
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(0)}
          className="min-h-11 w-full"
        >
          Edit answers
        </Button>
      </div>
    </div>
  ) : (
    <div className="space-y-7">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-semibold">
          Question {step + 1} of {steps.length}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-balance">
          {steps[step].title}
        </h1>
        <p className="text-muted-foreground text-base">{steps[step].helper}</p>
      </div>
      {step === 0 && (
        <ChoiceGrid
          choices={moodOptions}
          selected={values.mood_tags}
          onToggle={(value) => toggleList("mood_tags", value, 3)}
        />
      )}
      {step === 1 && (
        <div className="grid grid-cols-7 gap-2">
          {cookingDayOptions.map((day) => {
            const selected = values.cooking_days.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleList("cooking_days", day.value)}
                className={cn(
                  "border-border bg-card focus-visible:ring-ring flex min-h-16 flex-col items-center justify-center rounded-xl border-2 text-sm font-bold focus-visible:ring-3 focus-visible:outline-none",
                  selected && "border-primary bg-accent",
                )}
              >
                {day.label.slice(0, 1)}
                <span className="sr-only">{day.label}</span>
                <span
                  className={cn(
                    "mt-1 size-2 rounded-full",
                    selected ? "bg-primary" : "bg-muted",
                  )}
                />
              </button>
            );
          })}
        </div>
      )}
      {step === 2 && (
        <div className="space-y-8 text-center">
          <div className="flex items-center justify-center gap-6">
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              aria-label="Decrease household size"
              disabled={values.household_size === 1}
              onClick={() =>
                update("household_size", values.household_size - 1)
              }
            >
              <Minus />
            </Button>
            <div>
              <p className="text-7xl font-bold tracking-tight">
                {values.household_size}
              </p>
              <p className="text-muted-foreground mt-1">people</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              aria-label="Increase household size"
              disabled={values.household_size === 6}
              onClick={() =>
                update("household_size", values.household_size + 1)
              }
            >
              <Plus />
            </Button>
          </div>
          <button
            type="button"
            aria-pressed={values.has_kids}
            onClick={() => update("has_kids", !values.has_kids)}
            className={cn(
              "border-border bg-card hover:border-primary focus-visible:ring-ring flex min-h-12 w-full items-center justify-between rounded-xl border px-4 font-semibold focus-visible:ring-3 focus-visible:outline-none",
              values.has_kids && "border-primary bg-accent",
            )}
          >
            Cooking for kids too?
            <span aria-hidden="true">{values.has_kids ? "✓" : "+"}</span>
          </button>
        </div>
      )}
      {step === 3 && (
        <ChoiceGrid
          choices={dietOptions}
          selected={[values.diet]}
          multiple={false}
          onToggle={(value) => chooseDiet(value as PreferenceValues["diet"])}
        />
      )}
      {step === 4 && (
        <div className="space-y-3">
          <button
            type="button"
            aria-pressed={values.allergies.length === 0}
            onClick={() => update("allergies", [])}
            className={cn(
              "border-border bg-card hover:border-primary focus-visible:ring-ring min-h-12 w-full rounded-xl border-2 px-4 text-left font-semibold focus-visible:ring-3 focus-visible:outline-none",
              values.allergies.length === 0 && "border-primary bg-accent",
            )}
          >
            No allergies to plan around
          </button>
          <ChoiceGrid
            choices={allergyOptions}
            selected={values.allergies}
            onToggle={(value) => toggleList("allergies", value)}
          />
        </div>
      )}
      {step === 5 && (
        <ChoiceGrid
          choices={proteinsForDiet(values.diet)}
          selected={values.protein_likes}
          onToggle={(value) => toggleList("protein_likes", value)}
        />
      )}
      {step === 6 && (
        <div className="space-y-5">
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
              placeholder="e.g. mushrooms"
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
                    values.dislikes.filter(
                      (dislikeItem) => dislikeItem !== item,
                    ),
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
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
              Common picks
            </p>
            <div className="flex flex-wrap gap-2">
              {commonDislikes.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={values.dislikes.some(
                    (dislikeItem) =>
                      dislikeItem.toLowerCase() === item.toLowerCase(),
                  )}
                  onClick={() =>
                    values.dislikes.some(
                      (dislikeItem) =>
                        dislikeItem.toLowerCase() === item.toLowerCase(),
                    )
                      ? update(
                          "dislikes",
                          values.dislikes.filter(
                            (dislikeItem) =>
                              dislikeItem.toLowerCase() !== item.toLowerCase(),
                          ),
                        )
                      : addDislike(item)
                  }
                  className="border-border bg-card hover:border-primary focus-visible:ring-ring aria-pressed:border-primary aria-pressed:bg-accent min-h-10 rounded-full border px-3 text-sm font-medium focus-visible:ring-3 focus-visible:outline-none"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {step === 7 && (
        <div className="space-y-5">
          {(["max_minutes_weekday", "max_minutes_weekend"] as const).map(
            (field) => (
              <div key={field} className="space-y-2">
                <p className="font-semibold">
                  {field === "max_minutes_weekday" ? "Weeknights" : "Weekends"}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {timeValues.map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      aria-pressed={values[field] === minutes}
                      onClick={() => update(field, minutes)}
                      className="border-border bg-card hover:border-primary focus-visible:ring-ring aria-pressed:border-primary aria-pressed:bg-accent min-h-12 rounded-xl border-2 text-sm font-semibold focus-visible:ring-3 focus-visible:outline-none"
                    >
                      {minutes} min
                    </button>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-6 sm:px-8"
    >
      {!isSummary && (
        <div className="mb-10 flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label="Go back"
            disabled={step === 0}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
          >
            <ArrowLeft />
          </Button>
          <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-[width]"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}
      <div className={cn("mx-auto w-full max-w-xl", isSummary && "my-auto")}>
        {content}
      </div>
      <div className="bg-background/95 sticky bottom-0 mt-auto pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] backdrop-blur">
        <p role="alert" className="text-destructive mb-2 min-h-5 text-sm">
          {error}
        </p>
        <Button
          type="button"
          size="lg"
          className="min-h-12 w-full rounded-full text-base font-bold"
          disabled={pending}
          onClick={isSummary ? save : continueFlow}
        >
          {pending ? "Saving…" : isSummary ? "Plan my week" : "Continue"}
          {isSummary && <Check aria-hidden="true" />}
        </Button>
      </div>
    </main>
  );
}
