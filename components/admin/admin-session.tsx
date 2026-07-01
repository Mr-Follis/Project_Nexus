"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type LoginState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string };

export function AdminLogin() {
  const router = useRouter();
  const [state, setState] = useState<LoginState>({ status: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const token = String(formData.get("token") ?? "");
    setState({ status: "submitting" });

    let response: Response;
    let body: { ok?: boolean; error?: string };

    try {
      response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      body = await response.json();
    } catch {
      setState({ status: "error", message: "Sign-in request failed." });
      return;
    }

    if (!response.ok || !body.ok) {
      setState({
        status: "error",
        message: body.error ?? "Invalid admin token."
      });
      return;
    }

    setState({ status: "idle" });
    router.refresh();
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-text-primary">
        Admin sign-in required
      </h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Enter the admin access token to unlock the moderation queue. The token
        is exchanged for a secure, http-only session cookie.
      </p>
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <input
          name="token"
          type="password"
          autoComplete="off"
          required
          placeholder="ADMIN_ACCESS_TOKEN"
          className="w-full rounded-nexus border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-secondary/70"
        />
        <Button type="submit" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Signing in…" : "Sign in"}
        </Button>
        {state.status === "error" ? (
          <p className="text-sm text-status-warning">{state.message}</p>
        ) : null}
      </form>
    </Card>
  );
}

export function AdminLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onLogout() {
    setPending(true);

    try {
      await fetch("/api/admin/session", { method: "DELETE" });
    } catch {
      // A failed logout still falls through to a refresh below.
    }

    setPending(false);
    router.refresh();
  }

  return (
    <Button variant="secondary" onClick={onLogout} disabled={pending}>
      <LogOut className="h-4 w-4" aria-hidden />
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
