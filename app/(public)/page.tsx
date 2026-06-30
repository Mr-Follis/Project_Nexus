import Link from "next/link";
import { ArrowRight, Map, Search, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/layout/disclaimer";
import { Reveal } from "@/components/motion/reveal";

const featureCards = [
  {
    title: "Structured game knowledge",
    body: "A database-first foundation for pages, maps, search, AI answers, and future game hubs.",
    icon: ShieldCheck
  },
  {
    title: "Second-screen navigation",
    body: "Mobile-first routes for the GTA VI hub, map shell, entities, and assistant placeholder.",
    icon: Map
  },
  {
    title: "Search-ready architecture",
    body: "A clean app structure prepared for indexed entities, zero-result logs, and grouped results.",
    icon: Search
  }
];

export default function HomePage() {
  return (
    <div className="space-y-16 pb-12">
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,255,0.22),transparent_60%)]" />
        <Reveal className="mx-auto max-w-4xl text-center">
          <Badge tone="accent">Sprint 1 foundation</Badge>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-normal text-text-primary sm:text-7xl">
            Project Nexus
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-text-secondary">
            A premium, mobile-first game companion foundation where structured
            data will power maps, search, AI answers, guides, calculators, and
            future game hubs.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/gta-6">
                Open GTA VI hub
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin">Admin placeholder</Link>
            </Button>
          </div>
        </Reveal>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {featureCards.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card key={feature.title}>
              <Icon
                className="h-5 w-5 text-accent-secondary"
                aria-hidden="true"
              />
              <h2 className="mt-5 text-xl font-semibold text-text-primary">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {feature.body}
              </p>
            </Card>
          );
        })}
      </section>

      <Card className="border-accent-primary/30 bg-gradient-to-br from-bg-surface to-bg-elevated">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-accent-secondary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Data-first rule
            </div>
            <p className="mt-3 max-w-2xl text-2xl font-semibold text-text-primary">
              Enter data once. Use it everywhere.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
              Sprint 1 only creates the foundation. Public content, AI answers,
              map markers, and search results will later come from verified
              structured records rather than hardcoded game facts.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/gta-6/ask">View assistant placeholder</Link>
          </Button>
        </div>
      </Card>

      <Disclaimer />
    </div>
  );
}
