import { Store } from "lucide-react";

import { EntityCategoryPage } from "@/components/knowledge/entity-category-page";

export default function GtaSixShopsPage() {
  return (
    <EntityCategoryPage
      gameSlug="gta-6"
      entityType="shop"
      icon={Store}
      label="Entity category"
      title="Shops & Services"
      description="Officially revealed stores, salons, and mod shops across Leonida, sourced from Rockstar Games announcements with verification status on every record."
    />
  );
}
