"use client";

import { useEffect, useState } from "react";

/**
 * Live UTC readout for the Mission Control status bar. Renders a stable
 * placeholder until mounted so server and client markup always match.
 */
export function MissionClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().slice(11, 19) + " UTC");

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-xs tabular-nums text-text-secondary">
      {time ?? "--:--:-- UTC"}
    </span>
  );
}
