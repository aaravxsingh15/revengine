import { cn } from "@/lib/format";

export default function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "accent" | "accent-2" | "success" | "warning";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "bg-surface-3 text-muted border-border-subtle",
    accent: "bg-accent/10 text-accent border-accent/30",
    "accent-2": "bg-accent-2/10 text-accent-2 border-accent-2/30",
    success: "bg-success/10 text-success border-success/30",
    warning: "bg-warning/10 text-warning border-warning/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide uppercase",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
