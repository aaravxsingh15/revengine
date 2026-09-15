"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

export default function AnimatedNumber({
  value,
  duration = 1.1,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number | null;
  duration?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (value === null) return;

    const controls = animate(0, value, {
      duration: prefersReducedMotion ? 0 : duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, duration, prefersReducedMotion]);

  if (value === null) {
    return <span className={className}>N/A</span>;
  }

  return (
    <span className={className}>
      {display.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
