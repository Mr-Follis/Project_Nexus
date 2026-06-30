import { SearchPage } from "@/components/knowledge/search-page";

export default function GtaSixSearchPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  return <SearchPage gameSlug="gta-6" query={searchParams.q} />;
}
