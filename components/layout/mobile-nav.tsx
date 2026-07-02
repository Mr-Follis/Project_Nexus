"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Menu, Search, Send } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gta-6", label: "Hub", icon: Menu },
  { href: "/gta-6/search", label: "Search", icon: Search },
  { href: "/gta-6/map", label: "Map", icon: Map },
  { href: "/gta-6/submit", label: "Submit", icon: Send }
];

/**
 * App-style bottom tab bar, shown on small screens only. The desktop pill
 * nav in the header covers the full route set; this keeps the five core
 * destinations under the thumb.
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-bg-base/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <div className="h-px bg-gradient-to-r from-transparent via-accent-secondary/40 to-transparent" />
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 pb-2 pt-2.5 text-[10px] font-semibold uppercase tracking-wide transition duration-150 ease-standard",
                  isActive
                    ? "text-accent-secondary"
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-12 items-center justify-center rounded-full transition duration-150 ease-standard",
                    isActive && "bg-accent-secondary/12"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
