import { connection } from "next/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/get-user";
import { getAccountPreferences } from "@/lib/preferences/server";

export async function WorkspaceGate({ children }: { children: ReactNode }) {
  await connection();
  const user = await requireUser();
  const { profile } = await getAccountPreferences(user.id);
  if (!profile?.onboarding_completed_at) redirect("/onboarding");
  return children;
}
