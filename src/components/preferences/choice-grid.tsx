"use client";

import { cn } from "@/lib/utils";

type Choice = { value: string | number; label: string; emoji?: string };

export function ChoiceGrid({
  choices,
  selected,
  onToggle,
  multiple = true,
  className,
}: {
  choices: readonly Choice[];
  selected: readonly (string | number)[];
  onToggle: (value: string | number) => void;
  multiple?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {choices.map((choice) => {
        const pressed = selected.includes(choice.value);
        return (
          <button
            key={choice.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onToggle(choice.value)}
            className={cn(
              "border-border bg-card hover:border-primary focus-visible:ring-ring flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 px-3 text-center text-sm font-semibold transition-colors focus-visible:ring-3 focus-visible:outline-none",
              pressed && "border-primary bg-accent",
              !multiple && "min-h-24",
            )}
          >
            {choice.emoji && (
              <span className="text-2xl" aria-hidden="true">
                {choice.emoji}
              </span>
            )}
            <span>{choice.label}</span>
          </button>
        );
      })}
    </div>
  );
}
