



import React from "react";
import { useNavigationContext } from "./navigation/NavigationContext";

const RemoteApp = React.lazy(() => import("prolink_lookup_remote/App"));

export default function LookupPage() {
  const navigationContext = useNavigationContext();

  return (
    <React.Suspense fallback={<div>Loading ProLink-Lookup…</div>}>
      <RemoteApp navigationContext={navigationContext} />
    </React.Suspense>
  );
}