import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCars, getCarBySlug, getSimilarCars } from "@/lib/cars";
import CarHero from "@/components/car/CarHero";
import PerformanceDashboard from "@/components/car/PerformanceDashboard";
import {
  OverviewSpecs,
  EngineSpecs,
  TransmissionSpecs,
  DimensionsSpecs,
  ChassisSpecs,
  FuelSpecs,
  PricingSpecs,
} from "@/components/car/SpecSections";
import ProductionTimeline from "@/components/car/ProductionTimeline";
import CarGallery from "@/components/car/CarGallery";
import DidYouKnow from "@/components/car/DidYouKnow";
import CarGrid from "@/components/car/CarGrid";
import RecentlyViewedTracker from "@/components/car/RecentlyViewedTracker";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return getAllCars().map((car) => ({ slug: car.slug }));
}

export async function generateMetadata(props: PageProps<"/cars/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const car = getCarBySlug(slug);
  if (!car) return { title: "Car Not Found" };

  const title = `${car.company} ${car.model}${car.generation ? ` ${car.generation}` : ""} Specifications`;
  const description = `${car.company} ${car.model}: ${car.performance.horsepowerHp ?? "N/A"} hp, ${car.performance.torqueNm ?? "N/A"} Nm, 0-100 km/h in ${car.performance.zeroTo100Sec ?? "N/A"}s, top speed ${car.performance.topSpeedKmh ?? "N/A"} km/h. Full specs, history and comparisons on RevEngine.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function CarDetailPage(props: PageProps<"/cars/[slug]">) {
  const { slug } = await props.params;
  const car = getCarBySlug(slug);

  if (!car) notFound();

  const similarCars = getSimilarCars(car, getAllCars(), 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <RecentlyViewedTracker carId={car.id} />

      <CarHero car={car} />

      <section>
        <SectionHeading eyebrow="Performance" title="Performance Dashboard" />
        <PerformanceDashboard car={car} />
      </section>

      <section>
        <SectionHeading eyebrow="Under the Hood" title="Full Specifications" />
        <div className="grid md:grid-cols-2 gap-6">
          <OverviewSpecs car={car} />
          <EngineSpecs car={car} />
          <TransmissionSpecs car={car} />
          <DimensionsSpecs car={car} />
          <ChassisSpecs car={car} />
          <FuelSpecs car={car} />
          <PricingSpecs car={car} />
        </div>
      </section>

      {car.timeline.length > 0 && (
        <section>
          <SectionHeading eyebrow="History" title="Production Timeline" />
          <ProductionTimeline events={car.timeline} />
        </section>
      )}

      <section>
        <SectionHeading eyebrow="The Story" title="History & Development" />
        <div className="grid lg:grid-cols-3 gap-8">
          <p className="lg:col-span-2 text-muted leading-relaxed">{car.history}</p>
          <DidYouKnow facts={car.interestingFacts} />
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Gallery" title="Photo Gallery" description="Standard angle set — populated as photography becomes available." />
        <CarGallery car={car} />
      </section>

      {similarCars.length > 0 && (
        <section>
          <SectionHeading eyebrow="Keep Exploring" title="Similar Cars" />
          <CarGrid cars={similarCars} />
        </section>
      )}
    </div>
  );
}
