"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Home,
  Map,
  MapPin,
  Menu,
  Search,
  Send,
  Shield,
  Users
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gta-6", label: "Hub", icon: Menu },
  { href: "/gta-6/characters", label: "Characters", icon: Users },
  { href: "/gta-6/regions", label: "Places", icon: MapPin },
  { href: "/gta-6/map", label: "Map", icon: Map },
  { href: "/gta-6/search", label: "Search", icon: Search },
  { href: "/gta-6/submit", label: "Submit", icon: Send },
  { href: "/gta-6/ask", label: "Ask", icon: Bot },
  { href: "/admin", label: "Admin", icon: Shield }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation">
      <ul className="flex items-center gap-1 overflow-x-auto rounded-nexus border border-white/10 bg-bg-surface/80 p-1 shadow-[0_14px_50px_rgba(0,0,0,0.24)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium text-text-secondary transition duration-150 ease-standard hover:bg-white/[0.08] hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-secondary/70",
                  isActive &&
                    "bg-accent-secondary/12 text-text-primary ring-1 ring-accent-secondary/30"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
