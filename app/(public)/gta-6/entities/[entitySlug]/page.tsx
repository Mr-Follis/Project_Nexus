import { EntityDetailPage } from "@/components/knowledge/entity-detail-page";

export default function GtaSixEntityDetailPage({
  params
}: {
  params: { entitySlug: string };
}) {
  return <EntityDetailPage gameSlug="gta-6" entitySlug={params.entitySlug} />;
}
