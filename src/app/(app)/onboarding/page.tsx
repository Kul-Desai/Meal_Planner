import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/preferences/onboarding-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth/get-user";
import { getAccountPreferences } from "@/lib/preferences/server";
import { preferenceValuesFromRows } from "@/lib/preferences/values";

async function OnboardingContent() {
  await connection();
  const user = await requireUser();
  const { profile, preferences } = await getAccountPreferences(user.id);
  if (profile?.onboarding_completed_at) redirect("/plan");
  return (
    <OnboardingFlow
      initialValues={preferenceValuesFromRows(preferences, profile)}
    />
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <main id="main-content" className="mx-auto w-full max-w-2xl px-5 py-12">
          <Skeleton className="h-96 w-full" />
        </main>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
