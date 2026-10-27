import { Suspense } from "react";
import { connection } from "next/server";
import { ProtectedPlaceholder } from "@/components/layout/protected-placeholder";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth/get-user";
import { getAccountPreferences } from "@/lib/preferences/server";

function firstName(name: string | null, email: string | undefined) {
  return name?.trim().split(/\s+/)[0] || email || "there";
}

async function PlanContent() {
  await connection();
  const user = await requireUser();
  const { profile } = await getAccountPreferences(user.id);
  return (
    <section>
      <p className="text-foreground text-sm font-bold tracking-[0.16em] uppercase">
        Plan
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance">
        Good morning, {firstName(profile?.display_name ?? null, user.email)}
      </h1>
      <ProtectedPlaceholder description="Your dinner plan will appear here when you make one." />
    </section>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <PlanContent />
    </Suspense>
  );
}
