import { Database, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Admin foundation"
        title="Admin workspace placeholder"
        description="Sprint 1 reserves the admin surface for future data governance, entity CRUD, source management, submissions, verification, and AI review queues."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <Database
            className="h-5 w-5 text-accent-secondary"
            aria-hidden="true"
          />
          <h2 className="mt-5 text-xl font-semibold text-text-primary">
            Structured data first
          </h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Public pages should eventually render from records maintained here,
            not from handwritten one-off pages.
          </p>
        </Card>
        <Card>
          <ShieldCheck
            className="h-5 w-5 text-status-success"
            aria-hidden="true"
          />
          <h2 className="mt-5 text-xl font-semibold text-text-primary">
            Human review required
          </h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            AI suggestions, community submissions, and public factual updates
            must pass review before publishing.
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3">
          <Badge>Entity CRUD later</Badge>
          <Badge>Sources later</Badge>
          <Badge>Moderation later</Badge>
          <Badge>Audit log later</Badge>
        </div>
      </Card>
    </div>
  );
}
