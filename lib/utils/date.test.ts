import { describe, expect, it } from "vitest";

import { formatDate } from "./date";

describe("formatDate", () => {
  it("formats Date values consistently", () => {
    expect(formatDate(new Date("2026-06-30T12:00:00.000Z"))).toBe(
      "Jun 30, 2026"
    );
  });

  it("formats ISO string values consistently", () => {
    expect(formatDate("2026-06-30T12:00:00.000Z")).toBe("Jun 30, 2026");
  });

  it("returns a stable fallback for empty values", () => {
    expect(formatDate(null)).toBe("Not set");
    expect(formatDate(undefined)).toBe("Not set");
  });
});
