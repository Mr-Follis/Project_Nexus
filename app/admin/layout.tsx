import { AppShell } from "@/components/layout/app-shell";

/**
 * Admin surfaces reuse the public AppShell chrome for now; a dedicated admin
 * frame can replace this once the moderation workspace grows.
 */
export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
