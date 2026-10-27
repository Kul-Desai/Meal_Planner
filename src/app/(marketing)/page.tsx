import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/server";

async function SignedInRedirect() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(siteConfig.homePath);
  return null;
}

export default function Home() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-between gap-12 px-6 py-8 sm:px-10"
    >
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
      <section className="max-w-3xl">
        <span className="bg-secondary text-secondary-foreground inline-flex rounded-full px-3 py-1 text-sm font-semibold">
          Dinner, sorted
        </span>
        <h1 className="mt-5 text-5xl font-bold tracking-tight text-balance sm:text-7xl">
          Less what’s-for-dinner. More dinner.
        </h1>
        <p className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty">
          Tell us what your week looks like. We’ll help you plan dinners that
          share ingredients and fit the time you actually have.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 min-h-12 rounded-full px-6 text-base font-bold"
        >
          <Link href="/login">Start your plan</Link>
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
