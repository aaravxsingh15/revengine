import type { MetadataRoute } from "next";
import { getAllCars, getAllManufacturers } from "@/lib/cars";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://revengine.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/cars", "/manufacturers", "/compare", "/performance", "/garage"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const carRoutes = getAllCars().map((car) => ({
    url: `${BASE_URL}/cars/${car.slug}`,
    lastModified: new Date(),
  }));

  const manufacturerRoutes = getAllManufacturers().map((m) => ({
    url: `${BASE_URL}/manufacturers/${m.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...carRoutes, ...manufacturerRoutes];
}
