"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Gauge } from "lucide-react";
import SearchBar from "@/components/search/SearchBar";
import { useGarageIds } from "@/hooks/useGarage";
import { cn } from "@/lib/format";

const LINKS = [
  { href: "/cars", label: "Cars" },
  { href: "/manufacturers", label: "Manufacturers" },
  { href: "/compare", label: "Compare" },
  { href: "/performance", label: "Performance" },
  { href: "/garage", label: "Garage" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const garageIds = useGarageIds();

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <Gauge className="w-6 h-6 text-accent transition-transform group-hover:rotate-45 duration-300" />
            <span className="font-display font-bold text-xl tracking-tight">
              REV<span className="text-accent">ENGINE</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 text-sm font-medium rounded-full transition-colors",
                    active ? "text-foreground bg-surface-2" : "text-muted hover:text-foreground hover:bg-surface-2/60"
                  )}
                >
                  {link.label}
                  {link.href === "/garage" && garageIds.length > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-accent text-white text-[10px] font-bold px-1">
                      {garageIds.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block flex-1 max-w-xs ml-auto">
            <SearchBar variant="navbar" />
          </div>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border-subtle bg-background px-4 py-4 space-y-4">
          <SearchBar variant="navbar" autoFocus onNavigate={() => setMobileOpen(false)} />
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface-2 transition-colors"
              >
                {link.label}
                {link.href === "/garage" && garageIds.length > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-accent text-white text-[10px] font-bold px-1">
                    {garageIds.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
