import { Car } from "lucide-react";

import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function GtaSixVehiclesPage() {
  return (
    <PlaceholderPanel
      icon={Car}
      label="Entity placeholder"
      title="Vehicles"
      description="Database-ready placeholder for vehicle records, categories, acquisition methods, map links, verification labels, and comparison pages. Empty fields must stay empty instead of generating fake text."
    />
  );
}
