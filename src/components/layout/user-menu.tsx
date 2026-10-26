import { connection } from "next/server";
import { requireUser } from "@/lib/auth/get-user";
import { UserMenuClient } from "./user-menu-client";

export async function UserMenu() {
  await connection();
  const user = await requireUser();
  return <UserMenuClient email={user.email || "Your account"} />;
}
