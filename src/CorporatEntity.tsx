import React from "react";
import { useNavigationContext } from "./navigation/NavigationContext";

const CorporateEntityApp = React.lazy(() => import("corporateentity/App"));

export default function CorporateEntityPage() {
  const navigationContext = useNavigationContext();

  return (
    <React.Suspense fallback={<div>Loading Corporate Entity…</div>}>
      <CorporateEntityApp navigationContext={navigationContext} />
    </React.Suspense>
  );
}
