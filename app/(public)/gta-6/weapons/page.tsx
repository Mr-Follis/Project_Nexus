import { Crosshair } from "lucide-react";

import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function GtaSixWeaponsPage() {
  return (
    <PlaceholderPanel
      icon={Crosshair}
      label="Entity placeholder"
      title="Weapons"
      description="Database-ready placeholder for weapon records, unlock conditions, attachments, source status, related missions, and map marker links."
    />
  );
}
