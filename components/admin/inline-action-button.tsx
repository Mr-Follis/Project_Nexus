"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ActionState =
  | { status: "idle" }
  | { status: "working" }
  | { status: "error"; message: string };

/**
 * Small text-style action for inline admin rows (e.g. detaching a linked
 * source). Sends the given method to the endpoint and refreshes the server
 * component on success.
 */
export function InlineActionButton({
  endpoint,
  method,
  label
}: {
  endpoint: string;
  method: "DELETE" | "POST";
  label: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>({ status: "idle" });

  async function run() {
    setState({ status: "working" });

    let response: Response;
    let body: { ok?: boolean; error?: string };

    try {
      response = await fetch(endpoint, { method });
      body = await response.json();
    } catch {
      setState({ status: "error", message: "Request failed." });
      return;
    }

    if (!response.ok || !body.ok) {
      setState({ status: "error", message: body.error ?? "Action failed." });
      return;
    }

    setState({ status: "idle" });
    router.refresh();
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={run}
        disabled={state.status === "working"}
        className="text-xs font-medium text-status-warning hover:text-status-warning/80 disabled:opacity-60"
      >
        {state.status === "working" ? "Working…" : label}
      </button>
      {state.status === "error" ? (
        <span className="text-xs text-status-warning">{state.message}</span>
      ) : null}
    </span>
  );
}
