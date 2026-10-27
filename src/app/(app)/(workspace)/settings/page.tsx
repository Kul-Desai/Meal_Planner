import { Suspense } from "react";
import { connection } from "next/server";
import { AccountSettings } from "@/components/preferences/account-settings";
import { SettingsPreferencesForm } from "@/components/preferences/settings-preferences-form";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth/get-user";
import { getAccountPreferences } from "@/lib/preferences/server";
import { preferenceValuesFromRows } from "@/lib/preferences/values";

async function SettingsContent() {
  await connection();
  const user = await requireUser();
  const { profile, preferences } = await getAccountPreferences(user.id);
  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-foreground text-sm font-bold tracking-[0.16em] uppercase">
        Settings
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Make dinner planning fit your life
      </h1>
      <p className="text-muted-foreground mt-3 max-w-xl">
        Update what you enjoy, when you cook, and how much time you have.
      </p>
      <div className="mt-8">
        <SettingsPreferencesForm
          initialValues={preferenceValuesFromRows(preferences, profile)}
        />
      </div>
      <div className="mt-10">
        <AccountSettings email={user.email || "Your account"} />
      </div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <SettingsContent />
    </Suspense>
  );
}
