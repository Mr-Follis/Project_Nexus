import { Map } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function GtaSixMapPage() {
  return (
    <PlaceholderPanel
      icon={Map}
      label="Map placeholder"
      title="Interactive map shell"
      description="Prepared for future MapLibre rendering, marker categories, clustering, filters, entity links, and a mobile bottom sheet. No live game map or copyrighted assets are included in Sprint 1."
    >
      <PageHeader
        eyebrow="Future module"
        title="Map layers will render from approved marker records."
        description="The next implementation step is a data-backed marker model and a simple list/map toggle before a full map integration."
      />
    </PlaceholderPanel>
  );
}
