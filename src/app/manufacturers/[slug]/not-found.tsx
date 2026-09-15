import ErrorState from "@/components/ui/ErrorState";
import { Factory } from "lucide-react";

export default function ManufacturerNotFound() {
  return (
    <ErrorState
      icon={Factory}
      title="Manufacturer Not Found"
      description="We couldn't find a manufacturer at this address."
      actionHref="/manufacturers"
      actionLabel="Browse all manufacturers"
    />
  );
}
