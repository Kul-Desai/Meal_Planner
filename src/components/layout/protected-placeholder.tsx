import { Suspense } from "react";
import { connection } from "next/server";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth/get-user";

async function PrivateEmpty({ description }: { description: string }) {
  await connection();
  await requireUser();
  return (
    <Empty className="border-border bg-card mt-8 min-h-64 border border-dashed">
      <EmptyHeader>
        <EmptyTitle>Nothing here yet</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function ProtectedPlaceholder({
  title,
  description,
}: {
  title?: string;
  description: string;
}) {
  return (
    <section>
      {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
      <Suspense fallback={<Skeleton className="mt-8 h-64 w-full" />}>
        <PrivateEmpty description={description} />
      </Suspense>
    </section>
  );
}
