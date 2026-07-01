"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAdminToken } from "@/components/admin/admin-auth";

type ActionState =
  | { status: "idle" }
  | { status: "working"; target: string }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

function labelFor(status: string) {
  return status.replaceAll("_", " ");
}

export function SubmissionActions({
  submissionId,
  allowedStatuses
}: {
  submissionId: string;
  allowedStatuses: string[];
}) {
  const { token } = useAdminToken();
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<ActionState>({ status: "idle" });

  if (allowedStatuses.length === 0) {
    return (
      <p className="mt-5 border-t border-white/10 pt-4 text-xs font-medium text-text-muted">
        Terminal status — no further transitions available.
      </p>
    );
  }

  async function apply(status: string) {
    if (!token) {
      setState({
        status: "error",
        message: "Enter the admin token above to moderate."
      });
      return;
    }

    setState({ status: "working", target: status });

    let response: Response;
    let body: { ok?: boolean; error?: string };

    try {
      response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token
        },
        body: JSON.stringify({
          status,
          moderatorNotes: notes.trim() || undefined
        })
      });
      body = await response.json();
    } catch {
      setState({ status: "error", message: "Request failed." });
      return;
    }

    if (!response.ok || !body.ok) {
      setState({
        status: "error",
        message: body.error ?? "Moderation update failed."
      });
      return;
    }

    setNotes("");
    setState({
      status: "success",
      message:
        status === "approved"
          ? "Approved — a draft entity was created for review."
          : `Marked ${labelFor(status)}.`
    });
    router.refresh();
  }

  return (
    <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Moderator notes (optional)"
        rows={2}
        className="w-full rounded-nexus border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-secondary/70"
      />
      <div className="flex flex-wrap gap-2">
        {allowedStatuses.map((status) => (
          <Button
            key={status}
            variant={status === "approved" ? "primary" : "secondary"}
            disabled={state.status === "working"}
            onClick={() => apply(status)}
          >
            {state.status === "working" && state.target === status
              ? "Working…"
              : `Mark ${labelFor(status)}`}
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
