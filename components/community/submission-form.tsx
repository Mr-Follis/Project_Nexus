"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function SubmissionForm() {
  const [state, setState] = useState<SubmissionState>({ status: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    const formData = new FormData(event.currentTarget);
    let response: Response;
    let body: { ok?: boolean; error?: string };

    try {
      response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gameSlug: "gta-6",
          type: formData.get("type"),
          title: formData.get("title"),
          description: formData.get("description") || undefined,
          evidenceUrl: formData.get("evidenceUrl") || undefined,
          screenshotUrl: formData.get("screenshotUrl") || undefined
        })
      });
      body = await response.json();
    } catch {
      setState({
        status: "error",
        message: "Submission failed."
      });
      return;
    }

    if (!response.ok || !body.ok) {
      setState({
        status: "error",
        message: body.error ?? "Submission failed."
      });
      return;
    }

    event.currentTarget.reset();
    setState({
      status: "success",
      message: "Submission received for moderation."
    });
  }

  return (
    <Card>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Type" name="type" required defaultValue="evidence" />
          <Field label="Title" name="title" required />
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-text-primary">
            Description
          </span>
          <textarea
            name="description"
            rows={5}
            className="mt-2 w-full rounded-nexus border border-white/10 bg-white/[0.06] px-3 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent-secondary/60 focus:ring-2 focus:ring-accent-secondary/30"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Evidence URL" name="evidenceUrl" type="url" />
          <Field label="Screenshot URL" name="screenshotUrl" type="url" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {state.status === "success" ? (
            <Badge tone="success">{state.message}</Badge>
          ) : state.status === "error" ? (
            <Badge tone="warning">{state.message}</Badge>
          ) : (
            <Badge tone="default">Moderation queue</Badge>
          )}

          <Button type="submit" disabled={state.status === "submitting"}>
            <Send className="h-4 w-4" aria-hidden />
            {state.status === "submitting" ? "Submitting" : "Submit"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-text-primary">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-2 h-11 w-full rounded-nexus border border-white/10 bg-white/[0.06] px-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent-secondary/60 focus:ring-2 focus:ring-accent-secondary/30"
      />
    </label>
  );
}
