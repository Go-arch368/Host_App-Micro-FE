import React from "react";
import type { Location, NavigationType } from "react-router-dom";
import { useLocation, useNavigationType } from "react-router-dom";

export type NavigationKind = "reload" | "back_forward" | "in_app";

export type NavigationSnapshot = {
  pathname: string;
  search: string;
  hash: string;
  key?: string;
};

export type NavigationContextValue = {
  kind: NavigationKind;
  navigationType: NavigationType;
  from?: NavigationSnapshot;
  to: NavigationSnapshot;
  timestamp: number;
};

const NavigationContext = React.createContext<NavigationContextValue | null>(
  null,
);

const captureLocation = (location: Location): NavigationSnapshot => ({
  pathname: location.pathname,
  search: location.search,
  hash: location.hash,
  key: location.key,
});

const detectInitialNavigationKind = (): NavigationKind => {
  if (typeof performance === "undefined") {
    return "in_app";
  }

  const [entry] = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];
  if (entry?.type === "reload") {
    return "reload";
  }

  const legacyNav = (
    performance as Performance & {
      navigation?: { type?: number; TYPE_RELOAD?: number };
    }
  ).navigation;
  if (legacyNav?.type != null && legacyNav.type === legacyNav.TYPE_RELOAD) {
    return "reload";
  }

  return "in_app";
};

type NavigationProviderProps = {
  children: React.ReactNode;
};

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousLocation = React.useRef<Location | null>(null);
  const hasCapturedInitialLocation = React.useRef(false);

  const [contextValue, setContextValue] =
    React.useState<NavigationContextValue>(() => ({
      kind: detectInitialNavigationKind(),
      navigationType,
      to: captureLocation(location),
      timestamp: Date.now(),
    }));

  React.useEffect(() => {
    if (!hasCapturedInitialLocation.current) {
      hasCapturedInitialLocation.current = true;
      previousLocation.current = location;
      return;
    }

    const previous = previousLocation.current;

    if (
      previous &&
      previous.pathname === location.pathname &&
      previous.search === location.search &&
      previous.hash === location.hash &&
      previous.key === location.key
    ) {
      return;
    }

    const kind: NavigationKind =
      navigationType === "POP" && !previous
        ? "reload"
        : navigationType === "POP"
          ? "back_forward"
          : "in_app";

    setContextValue({
      kind,
      navigationType,
      from: previous ? captureLocation(previous) : undefined,
      to: captureLocation(location),
      timestamp: Date.now(),
    });

    previousLocation.current = location;
  }, [location, navigationType]);

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = (): NavigationContextValue => {
  const context = React.useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigationContext must be used within a NavigationProvider",
    );
  }
  return context;
};