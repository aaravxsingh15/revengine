"use client";

import { motion } from "framer-motion";
import type { TimelineEvent } from "@/types/car";

export default function ProductionTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) return null;

  return (
    <div className="relative pl-8">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border-strong" />
      <div className="space-y-8">
        {events.map((event, i) => (
          <motion.div
            key={`${event.year}-${event.label}`}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative"
          >
            <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-accent ring-4 ring-accent/20" />
            <p className="font-display text-lg font-bold text-accent">{event.year}</p>
            <p className="font-semibold">{event.label}</p>
            {event.description && <p className="text-sm text-muted mt-1">{event.description}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
