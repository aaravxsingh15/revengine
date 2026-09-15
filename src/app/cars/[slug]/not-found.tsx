import ErrorState from "@/components/ui/ErrorState";
import { CarFront } from "lucide-react";

export default function CarNotFound() {
  return (
    <ErrorState
      icon={CarFront}
      title="Car Not Found"
      description="We couldn't find a car at this address. It may have been removed, or the link might be incorrect."
      actionHref="/cars"
      actionLabel="Browse all cars"
    />
  );
}
