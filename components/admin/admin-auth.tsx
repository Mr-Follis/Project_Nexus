"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

const STORAGE_KEY = "nexus_admin_token";

type AdminAuthContextValue = {
  token: string;
  setToken: (token: string) => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState("");

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      setTokenState(stored);
    }
  }, []);

  function setToken(next: string) {
    setTokenState(next);

    if (next) {
      window.sessionStorage.setItem(STORAGE_KEY, next);
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  return (
    <AdminAuthContext.Provider value={{ token, setToken }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminToken() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminToken must be used within an AdminAuthProvider.");
  }

  return context;
}

export function AdminTokenField() {
  const { token, setToken } = useAdminToken();

  return (
    <div className="space-y-2">
      <label
        htmlFor="admin-token"
        className="text-xs font-semibold uppercase text-text-muted"
      >
        Admin access token
      </label>
      <input
        id="admin-token"
        type="password"
        autoComplete="off"
        value={token}
        onChange={(event) => setToken(event.target.value)}
        placeholder="Paste ADMIN_ACCESS_TOKEN to enable actions"
        className="w-full rounded-nexus border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-secondary/70"
      />
      <p className="text-xs text-text-muted">
        Held only in this browser tab (sessionStorage) and sent as the{" "}
        <code>x-admin-token</code> header. It is never stored on the server.
      </p>
    </div>
  );
}
