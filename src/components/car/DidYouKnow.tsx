import { Lightbulb } from "lucide-react";

export default function DidYouKnow({ facts }: { facts: string[] }) {
  if (facts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-accent" />
        <h3 className="font-display font-semibold">Did You Know?</h3>
      </div>
      <ul className="space-y-3">
        {facts.map((fact, i) => (
          <li key={i} className="flex gap-3 text-sm text-muted">
            <span className="font-display font-bold text-accent shrink-0">{String(i + 1).padStart(2, "0")}</span>
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}
