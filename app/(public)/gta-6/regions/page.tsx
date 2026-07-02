import { MapPin } from "lucide-react";

import { EntityCategoryPage } from "@/components/knowledge/entity-category-page";

export default function GtaSixRegionsPage() {
  return (
    <EntityCategoryPage
      gameSlug="gta-6"
      entityType="region"
      icon={MapPin}
      label="Entity category"
      title="Places & Regions"
      description="The officially named regions of Leonida, from Vice City to the Leonida Keys — sourced from Rockstar Games announcements with verification status on every record."
    />
  );
}
