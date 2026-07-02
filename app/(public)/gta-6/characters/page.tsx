import { Users } from "lucide-react";

import { EntityCategoryPage } from "@/components/knowledge/entity-category-page";

export default function GtaSixCharactersPage() {
  return (
    <EntityCategoryPage
      gameSlug="gta-6"
      entityType="character"
      icon={Users}
      label="Entity category"
      title="Characters"
      description="Officially revealed protagonists and supporting cast, sourced from Rockstar Games announcements. Every record carries verification status and source attribution."
    />
  );
}
