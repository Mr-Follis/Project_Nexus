"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export type RecordFieldConfig = {
  name: string;
  label: string;
  kind:
    | "text"
    | "textarea"
    | "select"
    | "number"
    | "date"
    | "datetime"
    | "tags"
    | "checkbox";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  defaultValue?: string;
  min?: number;
  max?: number;
  help?: string;
};

type FormState =
  | { status: "idle" }
  | { status: "working" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

const inputClassName =
  "w-full rounded-nexus border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-secondary/70";

/**
 * Shared admin create/edit form. Renders behind a toggle button, builds a
 * JSON payload from its field config (numbers parsed, comma lists split,
 * dates converted to ISO datetimes, empty optional fields omitted), submits
 * to the given endpoint, and refreshes the server component on success.
 * On edit (PUT) forms, emptying a text-like field that was prefilled sends
 * null (or [] for comma lists) so the existing value is cleared; fields that
 * were empty to begin with stay omitted.
 */
export function RecordForm({
  endpoint,
  method,
  fields,
  toggleLabel,
  submitLabel,
  successMessage
}: {
  endpoint: string;
  method: "POST" | "PUT";
  fields: RecordFieldConfig[];
  toggleLabel: string;
  submitLabel: string;
  successMessage: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildDefaultValues(fields)
  );
  const [state, setState] = useState<FormState>({ status: "idle" });

  function setValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function close() {
    setOpen(false);
    setState({ status: "idle" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "working" });

    let response: Response;
    let body: { ok?: boolean; error?: string };

    try {
      response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(fields, values, method))
      });
      body = await response.json();
    } catch {
      setState({ status: "error", message: "Request failed." });
      return;
    }

    if (!response.ok || !body.ok) {
      setState({ status: "error", message: body.error ?? "Save failed." });
      return;
    }

    if (method === "POST") {
      setValues(buildDefaultValues(fields));
    }

    setState({ status: "success", message: successMessage });
    router.refresh();
  }

  if (!open) {
    return (
      <div className="mt-4">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          {toggleLabel}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mt-4 space-y-4 rounded-nexus border border-white/10 bg-white/[0.03] p-4"
    >
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.name}
            className={
              field.kind === "textarea" ? "block md:col-span-2" : "block"
            }
          >
            <span className="mb-1 block text-xs font-medium text-text-muted">
              {field.label}
              {field.required ? " *" : ""}
            </span>
            {renderField(field, values[field.name] ?? "", (value) =>
              setValue(field.name, value)
            )}
            {field.help ? (
              <span className="mt-1 block text-xs text-text-muted">
                {field.help}
              </span>
            ) : null}
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={state.status === "working"}>
          {state.status === "working" ? "Working…" : submitLabel}
        </Button>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
      </div>
      {state.status === "error" ? (
        <p className="text-sm text-status-warning">{state.message}</p>
      ) : null}
      {state.status === "success" ? (
        <p className="text-sm text-status-success">{state.message}</p>
      ) : null}
    </form>
  );
}

function renderField(
  field: RecordFieldConfig,
  value: string,
  onChange: (value: string) => void
) {
  if (field.kind === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        rows={3}
        className={inputClassName}
      />
    );
  }

  if (field.kind === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={value === "true"}
        onChange={(event) => onChange(event.target.checked ? "true" : "")}
        className="h-5 w-5 accent-accent-primary"
      />
    );
  }

  if (field.kind === "select") {
    return (
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        className={inputClassName}
      >
        {field.required ? null : <option value="">—</option>}
        {(field.options ?? []).map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-bg-surface text-text-primary"
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={
        field.kind === "number"
          ? "number"
          : field.kind === "date" || field.kind === "datetime"
            ? "date"
            : "text"
      }
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      min={field.min}
      max={field.max}
      className={inputClassName}
    />
  );
}

function buildDefaultValues(fields: RecordFieldConfig[]) {
  const values: Record<string, string> = {};

  for (const field of fields) {
    values[field.name] =
      field.defaultValue ??
      (field.kind === "select" && field.required
        ? (field.options?.[0]?.value ?? "")
        : "");
  }

  return values;
}

const CLEARABLE_KINDS = new Set(["text", "textarea", "date", "datetime"]);

function buildPayload(
  fields: RecordFieldConfig[],
  values: Record<string, string>,
  method: "POST" | "PUT"
) {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    const raw = (values[field.name] ?? "").trim();

    // Checkboxes always submit an explicit boolean so unchecking a field
    // whose schema default is true still turns it off.
    if (field.kind === "checkbox") {
      payload[field.name] = raw === "true";
      continue;
    }

    if (!raw) {
      const hadValue = Boolean(field.defaultValue?.trim());

      if (method === "PUT" && hadValue && CLEARABLE_KINDS.has(field.kind)) {
        payload[field.name] = null;
      }

      if (method === "PUT" && hadValue && field.kind === "tags") {
        payload[field.name] = [];
      }

      continue;
    }

    if (field.kind === "number") {
      payload[field.name] = Number(raw);
      continue;
    }

    if (field.kind === "tags") {
      payload[field.name] = raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      continue;
    }

    if (field.kind === "datetime") {
      payload[field.name] = new Date(raw).toISOString();
      continue;
    }

    payload[field.name] = raw;
  }

  return payload;
}
