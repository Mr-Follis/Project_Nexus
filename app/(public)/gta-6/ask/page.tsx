import { Bot } from "lucide-react";

import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function GtaSixAskPage() {
  return (
    <PlaceholderPanel
      icon={Bot}
      label="AI placeholder"
      title="Ask Nexus"
      description="The public AI assistant is intentionally not implemented in Sprint 1. Future answers must be grounded in approved internal data, cite sources, and clearly say when facts are unknown."
    />
  );
}
