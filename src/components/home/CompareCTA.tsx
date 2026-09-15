import Link from "next/link";
import { GitCompare, ArrowRight } from "lucide-react";

export default function CompareCTA() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-br from-surface-2 via-surface to-surface-2 p-10 sm:p-14 text-center carbon-texture">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent-2/10 rounded-full blur-3xl" />
      </div>
      <div className="relative">
        <GitCompare className="w-8 h-8 text-accent-2 mx-auto mb-4" />
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Compare Your Dream Cars</h2>
        <p className="text-muted max-w-xl mx-auto mb-7">
          Put up to four cars head-to-head — engine, performance, dimensions and pricing, side by side, with the
          strongest number in each category called out automatically.
        </p>
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-6 py-3 text-sm font-semibold hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30 transition-all"
        >
          Start Comparing <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
