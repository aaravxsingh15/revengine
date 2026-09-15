import type { Metadata } from "next";
import CarsBrowseClient from "@/components/car/CarsBrowseClient";

export const metadata: Metadata = {
  title: "Browse Cars",
  description: "Search and filter every car in the RevEngine catalog by manufacturer, engine, performance, and more.",
};

export default async function CarsPage(props: PageProps<"/cars">) {
  const searchParams = await props.searchParams;
  const q = searchParams.q;
  const initialQuery = Array.isArray(q) ? q[0] : q ?? "";

  return <CarsBrowseClient initialQuery={initialQuery} />;
}
