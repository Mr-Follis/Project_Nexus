"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const DEFAULT_STATUSES = ["draft", "published", "hidden", "archived"] as const;

type ActionState =
  | { status: "idle" }
  | { status: "working"; target: string }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

/**
 * Shared record-status control used by admin lists (entities, media, ...). It
 * PATCHes { status } to the given endpoint and refreshes the server component.
 */
export function StatusActions({
  endpoint,
  currentStatus,
  statuses = DEFAULT_STATUSES
}: {
  endpoint: string;
  currentStatus: string;
  statuses?: readonly string[];
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>({ status: "idle" });

  async function apply(status: string) {
    setState({ status: "working", target: status });

    let response: Response;
    let body: { ok?: boolean; error?: string };

    try {
      response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      body = await response.json();
    } catch {
      setState({ status: "error", message: "Request failed." });
      return;
    }

    if (!response.ok || !body.ok) {
      setState({ status: "error", message: body.error ?? "Update failed." });
      return;
    }

    setState({ status: "success", message: `Now ${status}.` });
    router.refresh();
  }

  return (
    <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
      <div className="flex flex-wrap gap-2">
        {statuses
          .filter((status) => status !== currentStatus)
          .map((status) => (
            <Button
              key={status}
              variant={status === "published" ? "primary" : "secondary"}
              disabled={state.status === "working"}
              onClick={() => apply(status)}
            >
              {state.status === "working" && state.target === status
                ? "Working…"
                : status === "published"
                  ? "Publish"
                  : `Set ${status}`}
            </Button>
          ))}
      </div>
      {state.status === "error" ? (
        <p className="text-sm text-status-warning">{state.message}</p>
      ) : null}
      {state.status === "success" ? (
        <p className="text-sm text-status-success">{state.message}</p>
      ) : null}
    </div>
  );
}
