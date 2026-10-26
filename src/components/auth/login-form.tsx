"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { beginGoogleSignIn, sendMagicLink } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const linkError = searchParams.get("reason") === "link";

  function onEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      try {
        const result = await sendMagicLink({ email });
        if (!result.ok) setMessage(result.error);
        else if (result.data.sent)
          setMessage("Check your email for a sign-in link.");
        else router.replace("/plan");
      } catch {
        setMessage("Could not send a link. Try again shortly.");
      }
    });
  }

  function onGoogleClick() {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await beginGoogleSignIn({ provider: "google" });
        if (!result.ok) setMessage(result.error);
        else window.location.assign(result.data.url);
      } catch {
        setMessage("Google sign-in is unavailable. Try again later.");
      }
    });
  }

  return (
    <FieldGroup>
      {linkError && (
        <div role="alert" className="bg-muted rounded-lg p-4 text-sm">
          This link could not be used. Open it in the browser where you
          requested it, or send a new link below.
        </div>
      )}
      <form onSubmit={onEmailSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-describedby="email-help"
            />
            <FieldDescription id="email-help">
              We’ll send a sign-in link to this address.
            </FieldDescription>
          </Field>
          <Button type="submit" disabled={pending} className="w-full">
            {pending
              ? "Sending…"
              : linkError
                ? "Send a new link"
                : "Send sign-in link"}
          </Button>
        </FieldGroup>
      </form>
      <p aria-live="polite" className="text-muted-foreground text-sm">
        {message}
      </p>
      <div className="text-muted-foreground flex items-center gap-3 text-xs">
        <Separator className="flex-1" />
        or
        <Separator className="flex-1" />
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onGoogleClick}
        disabled={pending}
        className="w-full"
      >
        Continue with Google
      </Button>
    </FieldGroup>
  );
}
