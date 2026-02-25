

// src/app/WelcomePacket.tsx
import React from "react";
import { useNavigationContext } from "./navigation/NavigationContext";

const WelcomePacketApp = React.lazy(() => import("welcomepacket/App"));

export default function WelcomePacketPage() {
  const navigationContext = useNavigationContext();

  return (
    <React.Suspense fallback={<div>Loading Welcomepacket…</div>}>
      <WelcomePacketApp navigationContext={navigationContext} />
    </React.Suspense>
  );
}


import { NavigationData } from "./Navigation";

type MenuItem = NavigationData["menuList"][number];
type SubMenuItem = NonNullable<MenuItem["subMenuList"]>[number];

const menuMetadata = (): Pick<MenuItem, "eligibleRoleList" | "tagName"> => ({
  eligibleRoleList: [],
  tagName: "<customer-service>",
});

const buildUrlSubMenu = (menuName: string, linkpath: string): SubMenuItem => ({
  ...menuMetadata(),
  menuName,
  hasLink: "YES",
  linkType: "URL",
  linkpath,
  hasSubmenu: "NO",
  subMenu: [],
});

const buildMenu = (
  menuName: string,
  overrides: Partial<MenuItem> = {},
): MenuItem => ({
  ...menuMetadata(),
  menuName,
  hasLink: "No",
  linkType: "",
  linkpath: "",
  hasSubmenu: "No",
  ...overrides,
});

const portalName = "PROLINK_PORTAL";
