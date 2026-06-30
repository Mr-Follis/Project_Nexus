import { Route } from "lucide-react";

import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function GtaSixMissionsPage() {
  return (
    <PlaceholderPanel
      icon={Route}
      label="Guide placeholder"
      title="Missions"
      description="Mission route prepared for future database-backed guides, spoiler controls, objectives, rewards, recommended loadouts, and related map pins."
    />
  );
}
