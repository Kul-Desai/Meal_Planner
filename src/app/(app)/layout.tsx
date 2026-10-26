import { Suspense, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AppNav } from "@/components/layout/app-nav";
import { UserMenu } from "@/components/layout/user-menu";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-border bg-sidebar hidden w-60 shrink-0 flex-col gap-8 border-r px-4 py-7 md:flex">
        <span className="px-3 text-lg font-bold tracking-tight">
          Meal Planner
        </span>
        <AppNav />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-card flex h-16 items-center justify-between border-b px-5 md:justify-end md:px-8">
          <span className="text-lg font-bold tracking-tight md:hidden">
            Meal Planner
          </span>
          <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
            <UserMenu />
          </Suspense>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 pb-28 md:px-8 md:pb-8">
          {children}
        </main>
      </div>
      <div className="border-border bg-card fixed inset-x-0 bottom-0 z-10 border-t px-2 pb-[env(safe-area-inset-bottom)] md:hidden">
        <AppNav mobile />
      </div>
    </div>
  );
}
