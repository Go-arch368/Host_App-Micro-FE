// Routes.tsx
import React, { useEffect } from "react";
import { Security, LoginCallback } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./components/Okta/LoginForm";
import LookupPage from "./Lookup";
import RequireAuth from "./RequireAuth";
import PractitionerPage from "./Practitioner";
import FacilityPage from "./Faciltity";
import GroupPage from "./Group";
import CorporateEntityPage from "./CorporatEntity";
import Layout from "./Layout";
import WelcomePacketPage from "./WelcomePacket";
import Logout from "./components/Okta/Logout";
import { oktaLoginConfig } from "./components/Okta/OktaLoginConfig";
import NotFound from "./components/error/NotFound";
import ErrorPage from "./components/error/ErrorPage";

const AppRoutes: React.FC = () => {
  const oktaAuth = new OktaAuth({
    issuer: oktaLoginConfig.uri,
    clientId: oktaLoginConfig.clientId,
    redirectUri: oktaLoginConfig.callBackUrl,
    scopes: ["openid", "profile", "email", "offline_access"],
    tokenManager: {
      storage: "localStorage",
      autoRenew: true,
      autoRemove: true,
    },
    services: {
      autoRenew: true,
      autoRemove: true,
    },
  });

  const restoreOriginalUri = async (
    _oktaAuth: OktaAuth,
    originalUri: string,
  ) => {
    const target = toRelativeUrl(originalUri || "/", window.location.origin);
    window.location.replace(target);
  };

  const onAuthResume = async () => {
    window.location.replace(oktaLoginConfig.loginUrl);
  };

  const getUserProfile = (profile: Record<string, unknown>) => {
    console.log("Received user profile:", profile);
  };

  useEffect(() => {
    if (localStorage.getItem("okta-token-storage")) {
      const oktaStorage = localStorage.getItem("okta-token-storage");
      if (!oktaStorage) {
        return;
      }
      try {
        const parsed = JSON.parse(oktaStorage);
        const accessToken = parsed?.accessToken?.accessToken;
        if (
          accessToken &&
          (!localStorage.getItem("jwt") ||
            localStorage.getItem("jwt") !== accessToken)
        ) {
          localStorage.setItem("jwt", accessToken);
        }
      } catch {
        // Ignore malformed storage and retry on next render.
      }
    }
  }, [localStorage.getItem("okta-token-storage"), localStorage.getItem("jwt")]);

  return (
    <Security
      oktaAuth={oktaAuth}
      restoreOriginalUri={restoreOriginalUri}
      onAuthRequired={onAuthResume}
    >
      <Routes>
        {/* Routes available without authentication, no layout */}
        <Route
          path="/login"
          element={<LoginForm getUserProfile={getUserProfile} />}
        />
        <Route path="/login/callback" element={<LoginCallback />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes, no login required. Also children of Layout */}
        <Route element={<Layout />}>
          <Route path="/error" element={<ErrorPage />} />
        </Route>

        {/* Protected Routes, requires login to access. Also children of Layout */}
        <Route element={<Layout />}>
          <Route
            path="/lookup/*"
            element={
              <RequireAuth>
                <LookupPage />
              </RequireAuth>
            }
          />
          <Route
            path="/practitioner/*"
            element={
              <RequireAuth>
                <PractitionerPage />
              </RequireAuth>
            }
          />
          <Route
            path="/welcomepacket/*"
            element={
              <RequireAuth>
                <WelcomePacketPage />
              </RequireAuth>
            }
          />
          <Route
            path="/facility/*"
            element={
              <RequireAuth>
                <FacilityPage />
              </RequireAuth>
            }
          />
          <Route
            path="/group/*"
            element={
              <RequireAuth>
                <GroupPage />
              </RequireAuth>
            }
          />
          <Route
            path="/corporateentity/*"
            element={
              <RequireAuth>
                <CorporateEntityPage />
              </RequireAuth>
            }
          />
        </Route>

        <Route element={<Layout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Security>
  );
};

export default AppRoutes;