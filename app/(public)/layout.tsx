import { AppShell } from "@/components/layout/app-shell";

/**
 * Public site chrome. Lives at the route-group level (not the root layout) so
 * design-concept routes under /concepts can render their own full-page frames.
 */
export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
