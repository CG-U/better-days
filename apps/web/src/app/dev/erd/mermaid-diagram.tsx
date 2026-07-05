"use client";

import { useEffect, useState } from "react";

export function MermaidDiagram({ code }: { code: string }) {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    // Dynamic import keeps mermaid (~large) out of every other route's bundle.
    void import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: "neutral" });
      const { svg: rendered } = await mermaid.render("erd-diagram", code);
      if (alive) {
        setSvg(rendered);
      }
    });
    return () => {
      alive = false;
    };
  }, [code]);

  if (svg === null) {
    return <p className="text-muted-foreground">Rendering diagram...</p>;
  }

  return (
    <div
      className="overflow-x-auto rounded-2xl border border-border bg-card p-6 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-none"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
