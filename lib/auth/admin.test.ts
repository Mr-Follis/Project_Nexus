import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  env: {
    ADMIN_ACCESS_TOKEN: "dev-token",
    ADMIN_REVIEWER_ID: "dev-admin"
  }
}));

vi.mock("@/lib/config/env", () => ({
  env: mocks.env
}));

describe("admin auth", () => {
  beforeEach(() => {
    mocks.env.ADMIN_ACCESS_TOKEN = "dev-token";
    mocks.env.ADMIN_REVIEWER_ID = "dev-admin";
    vi.resetModules();
  });

  it("rejects API access when admin auth is not configured", async () => {
    mocks.env.ADMIN_ACCESS_TOKEN = undefined as unknown as string;
    const { authorizeAdminRequest } = await import("./admin");

    const result = authorizeAdminRequest(new Request("https://example.com"));

    expect(result).toEqual({
      ok: false,
      status: 503,
      configured: false,
      error: "Admin access is not configured."
    });
  });

  it("rejects API access without a valid token", async () => {
    const { authorizeAdminRequest } = await import("./admin");

    const result = authorizeAdminRequest(new Request("https://example.com"));

    expect(result).toEqual({
      ok: false,
      status: 401,
      configured: true,
      error: "Admin access is required."
    });
  });

  it("authorizes API access with a bearer token", async () => {
    const { authorizeAdminRequest } = await import("./admin");
    const request = new Request("https://example.com", {
      headers: { authorization: "Bearer dev-token" }
    });

    expect(authorizeAdminRequest(request)).toEqual({
      ok: true,
      reviewerId: "dev-admin"
    });
  });

  it("authorizes API access with x-admin-token", async () => {
    const { authorizeAdminRequest } = await import("./admin");
    const request = new Request("https://example.com", {
      headers: { "x-admin-token": "dev-token" }
    });

    expect(authorizeAdminRequest(request)).toEqual({
      ok: true,
      reviewerId: "dev-admin"
    });
  });

  it("authorizes API access with the session cookie", async () => {
    const { authorizeAdminRequest, getAdminTokenCookieName } =
      await import("./admin");
    const request = new Request("https://example.com", {
      headers: {
        cookie: `theme=dark; ${getAdminTokenCookieName()}=dev-token`
      }
    });

    expect(authorizeAdminRequest(request)).toEqual({
      ok: true,
      reviewerId: "dev-admin"
    });
  });

  it("rejects API access with a mismatched session cookie", async () => {
    const { authorizeAdminRequest, getAdminTokenCookieName } =
      await import("./admin");
    const request = new Request("https://example.com", {
      headers: { cookie: `${getAdminTokenCookieName()}=wrong-token` }
    });

    expect(authorizeAdminRequest(request)).toMatchObject({
      ok: false,
      status: 401
    });
  });
});
