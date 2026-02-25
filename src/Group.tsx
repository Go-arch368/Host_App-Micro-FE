import React from "react";
import { useNavigationContext } from "./navigation/NavigationContext";

const GroupApp = React.lazy(() => import("group/App"));

export default function GroupPage() {
  const navigationContext = useNavigationContext();

  return (
    <React.Suspense fallback={<div>Loading ProLink-Group..</div>}>
      <GroupApp navigationContext={navigationContext} />
    </React.Suspense>
  );
}
