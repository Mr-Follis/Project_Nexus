import type { Metadata } from "next";

import { ConceptSwitcher } from "@/components/concepts/concept-switcher";

export const metadata: Metadata = {
  title: "Design Concepts",
  robots: { index: false, follow: false }
};

/**
 * Bare frame for the design-concept homepages: no AppShell chrome, so each
 * concept controls its entire viewport. A floating switcher links the three
 * concepts and the live site for side-by-side review.
 */
export default function ConceptsLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {children}
      <ConceptSwitcher />
    </div>
  );
}
