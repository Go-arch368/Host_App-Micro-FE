import React from "react";
import { useNavigationContext } from "./navigation/NavigationContext";

const PractitionerApp = React.lazy(() => import("practitioner/App"));

export default function PractitionerPage() {
  const navigationContext = useNavigationContext();

  return (
    <React.Suspense fallback={<div>Loading ProLink-Practitioner…</div>}>
      <PractitionerApp navigationContext={navigationContext} />
    </React.Suspense>
  );
}