import { Suspense, type ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { WorkspaceGate } from "@/components/layout/workspace-gate";
import { Skeleton } from "@/components/ui/skeleton";

function WorkspaceFallback() {
  return <Skeleton className="h-64 w-full" />;
}

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <Suspense fallback={<WorkspaceFallback />}>
        <WorkspaceGate>{children}</WorkspaceGate>
      </Suspense>
    </AppShell>
  );
}
