import { Send } from "lucide-react";

import { SubmissionForm } from "@/components/community/submission-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";

export default function GtaSixSubmitPage() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Community"
        title="Submit evidence"
        description="Community submissions enter a moderation queue and do not publish directly."
        actions={
          <Badge tone="warning">
            <Send className="mr-2 h-3.5 w-3.5" aria-hidden />
            Review required
          </Badge>
        }
      />

      <SubmissionForm />
    </div>
  );
}
