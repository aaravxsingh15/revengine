import Link from "next/link";
import { Gauge } from "lucide-react";

const NAV_GROUPS = [
  {
    title: "Explore",
    links: [
      { href: "/cars", label: "Browse Cars" },
      { href: "/manufacturers", label: "Manufacturers" },
      { href: "/performance", label: "Performance Leaderboards" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/compare", label: "Compare Cars" },
      { href: "/garage", label: "My Garage" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Gauge className="w-6 h-6 text-accent" />
              <span className="font-display font-bold text-lg tracking-tight">
                REV<span className="text-accent">ENGINE</span>
              </span>
            </Link>
            <p className="text-sm text-muted max-w-sm">
              Every Spec. Every Rev. — the automotive spec vault for enthusiasts who want the full
              picture: performance, engineering, history and head-to-head comparisons in one place.
            </p>
          </div>

          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-3">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-2">
            © {new Date().getFullYear()} RevEngine. A fan-made automotive reference project, unaffiliated with any manufacturer listed.
          </p>
          <p className="text-xs text-muted-2 max-w-md">
            Specifications are compiled from public manufacturer data and may vary by market and model year. Missing values are shown as N/A rather than estimated.
          </p>
        </div>
      </div>
    </footer>
  );
}
