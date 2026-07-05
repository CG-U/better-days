import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MermaidDiagram } from "./mermaid-diagram";

// Dev-only visualization of docs/database/ERD.md — reads the file on every
// request so it always reflects the latest schema docs.
export const dynamic = "force-dynamic";

export const metadata = { title: "Database ERD — Better Days (dev)" };

const ERD_PATH = path.join(
  process.cwd(),
  "..",
  "..",
  "docs",
  "database",
  "ERD.md",
);

const MERMAID_BLOCK = /```mermaid\n([\s\S]*?)```/;

export default async function ErdPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  let markdown: string;
  try {
    markdown = await fs.readFile(ERD_PATH, "utf8");
  } catch {
    notFound();
  }

  const diagram = MERMAID_BLOCK.exec(markdown)?.[1];
  if (!diagram) {
    notFound();
  }

  const notes = markdown.replace(MERMAID_BLOCK, "").trim();

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-5 md:p-10">
      <header className="space-y-1">
        <h1 className="font-heading text-3xl font-bold">Database ERD</h1>
        <p className="text-muted-foreground">
          Rendered from <code>docs/database/ERD.md</code> — dev only. Tables
          marked <em>planned</em> do not exist yet.
        </p>
      </header>
      <MermaidDiagram code={diagram} />
      <pre className="overflow-x-auto rounded-2xl border border-border bg-muted/60 p-6 text-sm leading-relaxed whitespace-pre-wrap">
        {notes}
      </pre>
    </main>
  );
}
