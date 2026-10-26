"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Heart, ListChecks, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Plan", href: "/plan", icon: CalendarDays },
  { label: "Groceries", href: "/groceries", icon: ListChecks },
  { label: "Meals", href: "/meals", icon: Heart },
  { label: "Settings", href: "/settings", icon: Settings2 },
] as const;

export function AppNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main navigation"
      className={mobile ? "grid grid-cols-4 gap-1" : "flex flex-col gap-1"}
    >
      {items.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-muted-foreground focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground flex min-h-12 items-center justify-center gap-2 rounded-lg text-sm font-medium focus-visible:ring-2 focus-visible:outline-none",
              mobile
                ? "flex-col gap-0.5 px-1 py-2 text-xs"
                : "justify-start px-3",
              active && "bg-accent text-accent-foreground",
            )}
          >
            <Icon aria-hidden="true" className="size-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
