
import React from "react";
import { useNavigationContext } from "./navigation/NavigationContext";

const FacilityApp = React.lazy(() => import("facility/App"));

export default function FacilityPage() {
  const navigationContext = useNavigationContext();

  return (
    <React.Suspense fallback={<div>Loading ProLink-Facility..</div>}>
      <FacilityApp navigationContext={navigationContext} />
    </React.Suspense>
  );
}