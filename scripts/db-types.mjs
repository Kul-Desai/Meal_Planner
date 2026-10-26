import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { format } from "prettier";

const result = spawnSync(
  "supabase",
  [
    "gen",
    "types",
    "typescript",
    "--project-id",
    "ptvdczmwkwqkxlintzri",
    "--schema",
    "public",
  ],
  { encoding: "utf8" },
);

if (result.error || result.status !== 0) {
  process.stderr.write(
    result.stderr ||
      result.stdout ||
      String(result.error || "Type generation failed.\n"),
  );
  process.stderr.write(
    "Run `npx supabase login` (or set SUPABASE_ACCESS_TOKEN) before generating remote types.\n",
  );
  process.exit(result.status || 1);
}

const formattedTypes = await format(result.stdout, {
  filepath: "src/lib/supabase/database.types.ts",
});

writeFileSync("src/lib/supabase/database.types.ts", formattedTypes);
process.stdout.write("Wrote src/lib/supabase/database.types.ts\n");
