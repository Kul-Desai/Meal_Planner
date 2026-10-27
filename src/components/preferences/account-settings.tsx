"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function AccountSettings({ email }: { email: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onSignOut() {
    setError("");
    startTransition(async () => {
      const result = await signOut({ intent: "sign-out" });
      if (!result.ok) return setError(result.error);
      router.replace("/");
      router.refresh();
    });
  }

  return (
    <section className="border-border bg-card space-y-3 rounded-2xl border p-5">
      <div>
        <h2 className="text-xl font-bold">Account</h2>
        <p className="text-muted-foreground text-sm">{email}</p>
      </div>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={onSignOut}
      >
        {pending ? "Signing out…" : "Sign out"}
      </Button>
    </section>
  );
}
