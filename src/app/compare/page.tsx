import type { Metadata } from "next";
import ComparePageClient from "@/components/compare/ComparePageClient";

export const metadata: Metadata = {
  title: "Compare Cars",
  description: "Compare up to four cars head-to-head — engine, performance, dimensions and pricing, side by side.",
};

function parseSlugs(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

export default async function ComparePage(props: PageProps<"/compare">) {
  const searchParams = await props.searchParams;
  const initialSlugs = parseSlugs(searchParams.cars);

  return <ComparePageClient initialSlugs={initialSlugs} />;
}
