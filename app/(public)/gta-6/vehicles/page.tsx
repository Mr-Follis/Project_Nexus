import { Car } from "lucide-react";

import { EntityCategoryPage } from "@/components/knowledge/entity-category-page";

export default function GtaSixVehiclesPage() {
  return (
    <EntityCategoryPage
      gameSlug="gta-6"
      entityType="vehicle"
      icon={Car}
      label="Entity category"
      title="Vehicles"
      description="Database-ready placeholder for vehicle records, categories, acquisition methods, map links, verification labels, and comparison pages. Empty fields must stay empty instead of generating fake text."
    />
  );
}
