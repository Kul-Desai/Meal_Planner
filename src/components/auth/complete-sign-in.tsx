"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const fragmentSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
});

export function CompleteSignIn() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    async function complete() {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const parsed = fragmentSchema.safeParse(Object.fromEntries(params));
      window.history.replaceState(null, "", window.location.pathname);
      if (!parsed.success) {
        if (active) router.replace("/login?reason=link");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.setSession(parsed.data);
      if (active) router.replace(error ? "/login?reason=link" : "/plan");
    }
    void complete();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <p role="status" className="text-muted-foreground text-sm">
      Completing sign-in…
    </p>
  );
}
