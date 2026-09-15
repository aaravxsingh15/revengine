import ErrorState from "@/components/ui/ErrorState";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <ErrorState
      icon={Compass}
      title="Page Not Found"
      description="This page doesn't exist. Try browsing the full catalog instead."
      actionHref="/"
      actionLabel="Back to Home"
    />
  );
}
