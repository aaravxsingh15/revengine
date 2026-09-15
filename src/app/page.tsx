import HeroShowcase from "@/components/home/HeroShowcase";
import ManufacturersByCountry from "@/components/home/ManufacturersByCountry";
import PerformanceLeadersPreview from "@/components/home/PerformanceLeadersPreview";
import CompareCTA from "@/components/home/CompareCTA";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import CarGrid from "@/components/car/CarGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import { getAllCars, getCarBySlug } from "@/lib/cars";

const SHOWCASE_SLUGS = [
  "nissan-gtr-r34",
  "ferrari-f40",
  "mclaren-f1",
  "bugatti-veyron-164",
  "lamborghini-aventador-svj",
  "porsche-911-gt3-992",
];

const FEATURED_SLUGS = [
  "toyota-supra-mk4",
  "porsche-carrera-gt",
  "ferrari-458-italia",
  "mclaren-720s",
  "chevrolet-corvette-c8-z06",
  "bmw-m4-g82-competition",
  "audi-r8-v10-performance",
  "ford-gt-2017",
];

const ENTHUSIAST_SLUGS = [
  "mazda-rx7-fd",
  "honda-s2000-ap2",
  "mitsubishi-lancer-evolution-ix",
  "bmw-m3-e46",
  "toyota-ae86",
  "subaru-wrx-sti-va",
  "toyota-gr86",
  "nissan-silvia-s15",
];

function pick(slugs: string[]) {
  return slugs.map((s) => getCarBySlug(s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
}

export default function Home() {
  const allCars = getAllCars();
  const showcaseCars = pick(SHOWCASE_SLUGS);
  const featuredCars = pick(FEATURED_SLUGS);
  const enthusiastCars = pick(ENTHUSIAST_SLUGS);

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <HeroShowcase cars={showcaseCars} />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          eyebrow={`${allCars.length} Cars in the Vault`}
          title="Featured Cars"
          description="A rotating selection of enthusiast machines spanning JDM legends, German precision, and Italian excess."
          actionHref="/cars"
          actionLabel="Browse all cars"
        />
        <CarGrid cars={featuredCars} />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          eyebrow="By Origin"
          title="Manufacturers"
          description="From Japanese tuner icons to European hypercar ateliers — browse the full RevEngine catalog by brand."
          actionHref="/manufacturers"
          actionLabel="View all manufacturers"
        />
        <ManufacturersByCountry />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          eyebrow="The Numbers"
          title="Performance Leaders"
          description="Dynamically calculated from every car in the database — updated the moment new cars are added."
          actionHref="/performance"
          actionLabel="Full leaderboards"
        />
        <PerformanceLeadersPreview />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <CompareCTA />
      </section>

      <RecentlyViewed />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          eyebrow="Curated"
          title="Enthusiast Picks"
          description="The driver's cars — light, analog, and built for the connection between right foot and rear wheels."
          actionHref="/cars"
          actionLabel="See more"
        />
        <CarGrid cars={enthusiastCars} />
      </section>
    </div>
  );
}
