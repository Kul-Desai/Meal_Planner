import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

const serverSchema = publicSchema.extend({
  SUPABASE_SECRET_KEY: z.string().min(1).optional(),
  AI_PROVIDER: z
    .enum(["mock", "openai", "anthropic", "gateway"])
    .default("mock"),
});

type EnvSource = Record<string, string | undefined>;

function parse<T extends z.ZodType>(schema: T, source: EnvSource): z.output<T> {
  const result = schema.safeParse(source);
  if (result.success) return result.data;

  const fields = result.error.issues
    .map((issue) => issue.path.join("."))
    .join(", ");
  throw new Error(`Invalid environment variables: ${fields}`);
}

export function parsePublicEnv(source: EnvSource) {
  return parse(publicSchema, source);
}

export function parseServerEnv(source: EnvSource) {
  return parse(serverSchema, source);
}

export function getPublicEnv() {
  return parsePublicEnv({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}

export function getServerEnv() {
  return parseServerEnv({
    ...getPublicEnv(),
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || undefined,
    AI_PROVIDER: process.env.AI_PROVIDER,
  });
}
