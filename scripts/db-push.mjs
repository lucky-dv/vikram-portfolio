// Safe wrapper around `prisma db push`.
// This project shares datavruti's Postgres. Pushing without schema=portfolio would make Prisma
// try to DROP datavruti's tables in the "public" schema, so refuse unless both URLs are scoped.
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

for (const f of [".env.local", ".env"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=("?)(.*)\2\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[3];
  }
}

for (const key of ["DATABASE_URL", "DIRECT_URL"]) {
  const url = process.env[key] || "";
  const schema = (() => { try { return new URL(url).searchParams.get("schema"); } catch { return null; } })();
  if (schema !== "portfolio") {
    console.error(`\n✖ Refusing to push: ${key} must include schema=portfolio (found: ${schema ?? "none"}).`);
    console.error("  Without it Prisma would try to drop datavruti's tables.\n");
    process.exit(1);
  }
}
console.log("✓ Both URLs scoped to schema=portfolio. Pushing…");
execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
