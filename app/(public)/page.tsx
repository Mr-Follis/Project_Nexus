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
      <section className="relative left-1/2 min-h-[calc(100vh-8rem)] w-screen -translate-x-1/2 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[url('/images/nexus-city-intel-hero.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,15,0.96)_0%,rgba(8,10,15,0.82)_38%,rgba(8,10,15,0.22)_100%),linear-gradient(180deg,rgba(8,10,15,0.2)_0%,rgba(8,10,15,0.78)_100%)]" />

        <Reveal className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col justify-end px-4 pb-12 pt-24 sm:px-6 lg:pb-16">
          <div className="max-w-3xl">
            <Badge tone="accent">Structured game intelligence</Badge>
            <h1 className="mt-6 text-balance text-5xl font-semibold text-text-primary sm:text-7xl">
              Project Nexus
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-text-secondary">
              A premium companion platform where verified game data powers maps,
              search, AI answers, guides, and future game hubs from one
              structured knowledge layer.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/gta-6">
                  Open GTA VI hub
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/gta-6/search">Search shell</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            <div className="border-l border-accent-secondary/60 pl-4">
              <p className="text-2xl font-semibold text-text-primary">1</p>
              <p className="mt-1 text-sm text-text-secondary">
                Knowledge graph source of truth
              </p>
            </div>
            <div className="border-l border-status-warning/60 pl-4">
              <p className="text-2xl font-semibold text-text-primary">6</p>
              <p className="mt-1 text-sm text-text-secondary">
                Public API surfaces online
              </p>
            </div>
            <div className="border-l border-accent-primary/60 pl-4">
              <p className="text-2xl font-semibold text-text-primary">25</p>
              <p className="mt-1 text-sm text-text-secondary">
                Foundation tests passing
              </p>
            </div>
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
