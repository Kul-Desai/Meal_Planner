import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/server";

async function SignedInRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(siteConfig.homePath);
  return null;
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-between gap-12 px-6 py-8 sm:px-10">
      <Suspense fallback={null}>
        <SignedInRedirect />
      </Suspense>
      <header className="flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight">
          {siteConfig.name}
        </span>
        <Button asChild variant="outline">
          <Link href="/login">Sign in</Link>
        </Button>
      </header>
      <section className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          Dinner plans that make the week easier.
        </h1>
        <p className="text-muted-foreground mt-6 max-w-xl text-lg">
          Plan dinners that share ingredients, then shop from one combined list.
          Change a night whenever plans change.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/login">Get started</Link>
        </Button>
      </section>
      <footer className="text-muted-foreground flex gap-6 text-sm">
        <Link className="hover:text-foreground" href="/privacy">
          Privacy
        </Link>
        <Link className="hover:text-foreground" href="/terms">
          Terms
        </Link>
      </footer>
    </main>
  );
}
