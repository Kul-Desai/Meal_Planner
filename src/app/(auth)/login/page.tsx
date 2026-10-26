import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-5 py-12">
      <Link href="/" className="text-center text-lg font-bold tracking-tight">
        Meal Planner
      </Link>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <CardDescription>
            Get a link in your email, or continue with Google.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-center text-xs">
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy
        </Link>
        {" · "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms
        </Link>
      </p>
    </main>
  );
}
