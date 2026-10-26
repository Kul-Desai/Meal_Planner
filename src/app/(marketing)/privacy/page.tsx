import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-12">
      <Link
        className="text-muted-foreground hover:text-foreground text-sm"
        href="/"
      >
        Meal Planner
      </Link>
      <h1 className="text-3xl font-bold">Privacy</h1>
      <p className="text-muted-foreground">
        Our privacy information is being prepared before public launch.
      </p>
    </main>
  );
}
