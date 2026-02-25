// RequireAuth.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { JSX } from "react";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { authState, oktaAuth } = useOktaAuth();
  const location = useLocation();

  // While Okta is initializing or renewing tokens
  if (!authState) return null; // or your spinner

  if (!authState.isAuthenticated) {
    // Save where the user was trying to go, so we can send them back after login
    oktaAuth.setOriginalUri(location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  return children;
}
