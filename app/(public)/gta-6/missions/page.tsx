import { Route } from "lucide-react";

import { EntityCategoryPage } from "@/components/knowledge/entity-category-page";

export default function GtaSixMissionsPage() {
  return (
    <EntityCategoryPage
      gameSlug="gta-6"
      entityType="mission"
      icon={Route}
      label="Guide category"
      title="Missions"
      description="Mission route prepared for future database-backed guides, spoiler controls, objectives, rewards, recommended loadouts, and related map pins."
    />
  );
}
