"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <div className="w-14 h-14 rounded-full bg-surface-2 border border-border-subtle flex items-center justify-center mb-5">
        <AlertOctagon className="w-6 h-6 text-accent" />
      </div>
      <h2 className="font-display text-2xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted max-w-md mb-6">
        RevEngine hit an unexpected error loading this page. This has been logged — try again in a moment.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-5 py-2.5 text-sm font-semibold hover:bg-accent/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
