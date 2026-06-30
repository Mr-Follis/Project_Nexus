import Link from "next/link";
import { Search } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDatabaseUrl } from "@/lib/db/client";
import {
  getPublicGameBySlug,
  searchPublicEntities
} from "@/lib/db/repositories/knowledge";
import { formatDate } from "@/lib/utils/date";

type SearchPageProps = {
  gameSlug: string;
  query?: string;
};

export async function SearchPage({ gameSlug, query = "" }: SearchPageProps) {
  const trimmedQuery = query.trim();
  const state = await getSearchResults(gameSlug, trimmedQuery);
  const groupedResults = groupResultsByType(state.results);

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Search"
        title="Search GTA VI"
        description="Published knowledge records will appear here after sourced data is reviewed."
        actions={
          <Badge tone={state.results.length > 0 ? "success" : "warning"}>
            {state.statusLabel}
          </Badge>
        }
      />

      <Card>
        <form
          action="/gta-6/search"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label className="sr-only" htmlFor="search-query">
            Search query
          </label>
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              aria-hidden
            />
            <input
              id="search-query"
              name="q"
              defaultValue={trimmedQuery}
              placeholder="Search published records"
              className="h-11 w-full rounded-nexus border border-white/10 bg-white/[0.06] pl-10 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent-secondary/60 focus:ring-2 focus:ring-accent-secondary/30"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-text-primary">
          {state.heading}
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {state.message}
        </p>
      </Card>

      {groupedResults.length > 0 ? (
        <div className="space-y-8">
          {groupedResults.map((group) => (
            <section key={group.type} className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold capitalize text-text-primary">
                  {group.type.replaceAll("_", " ")}
                </h2>
                <Badge tone="default">{group.results.length}</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {group.results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/gta-6/entities/${result.slug}`}
                    className="group block"
                  >
                    <Card className="h-full transition duration-200 ease-standard group-hover:-translate-y-1 group-hover:border-accent-secondary/50">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">
                            {result.name}
                          </h3>
                          {result.summary ? (
                            <p className="mt-3 text-sm leading-6 text-text-secondary">
                              {result.summary}
                            </p>
                          ) : null}
                          <p className="mt-4 text-xs font-medium text-text-muted">
                            Last updated {formatDate(result.updatedAt)}
                          </p>
                        </div>
                        <Badge tone="default">{result.verification}</Badge>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function groupResultsByType<T extends { type: string }>(results: T[]) {
  const groups = new Map<string, T[]>();

  for (const result of results) {
    const group = groups.get(result.type) ?? [];
    group.push(result);
    groups.set(result.type, group);
  }

  return Array.from(groups.entries()).map(([type, groupResults]) => ({
    type,
    results: groupResults
  }));
}

async function getSearchResults(gameSlug: string, query: string) {
  if (!query) {
    return {
      statusLabel: "Waiting",
      heading: "No query entered",
      message:
        "Search results will be limited to published, reviewed knowledge records.",
      results: []
    };
  }

  if (query.length < 2) {
    return {
      statusLabel: "Query too short",
      heading: "No results",
      message: "Search queries must use at least two characters.",
      results: []
    };
  }

  if (!getDatabaseUrl()) {
    return {
      statusLabel: "Database not configured",
      heading: "Search unavailable",
      message: "Set DATABASE_URL to search published knowledge records.",
      results: []
    };
  }

  try {
    const game = await getPublicGameBySlug(gameSlug);

    if (!game) {
      return {
        statusLabel: "No published game",
        heading: "Search unavailable",
        message:
          "No published game record is available yet. Draft foundation records are intentionally excluded.",
        results: []
      };
    }

    const results = await searchPublicEntities({
      query,
      gameId: game.id,
      limit: 20
    });

    return {
      statusLabel:
        results.length > 0 ? `${results.length} found` : "No results",
      heading: results.length > 0 ? "Results" : "No results",
      message:
        results.length > 0
          ? "Results are loaded from published knowledge graph records."
          : "No published records matched this query.",
      results
    };
  } catch (error) {
    return {
      statusLabel: "Search unavailable",
      heading: "Search unavailable",
      message:
        error instanceof Error ? error.message : "Search could not be reached.",
      results: []
    };
  }
}
