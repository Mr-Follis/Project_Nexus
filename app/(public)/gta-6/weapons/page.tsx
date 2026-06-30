import { Crosshair } from "lucide-react";

import { EntityCategoryPage } from "@/components/knowledge/entity-category-page";

export default function GtaSixWeaponsPage() {
  return (
    <EntityCategoryPage
      gameSlug="gta-6"
      entityType="weapon"
      icon={Crosshair}
      label="Entity category"
      title="Weapons"
      description="Database-ready placeholder for weapon records, unlock conditions, attachments, source status, related missions, and map marker links."
    />
  );
}
