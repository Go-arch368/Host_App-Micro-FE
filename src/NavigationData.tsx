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

export const NavigationItems: NavigationData[] = [
  {
    portalName,
    application: "HOST_GUI",
    menuList: [
      buildMenu("Search", {
        hasLink: "Yes",
        linkType: "SubMenu",
        hasSubmenu: "Yes",
        subMenuList: [
          buildUrlSubMenu("Group Search", "/lookup/search-group"),
          buildUrlSubMenu("Practitioner Search", "/lookup/search"),
          buildUrlSubMenu(
            "Corporate Entity Search",
            "/lookup/search-corporate-entity",
          ),
          buildUrlSubMenu("Facility Search", "/lookup/search-facility"),
        ],
      }),
    ],
  },
  {
    portalName,
    product: "Add",
    menuList: [
      buildMenu("Add", {
        hasLink: "Yes",
        linkType: "subMenu",
        hasSubmenu: "Yes",
        subMenuList: [
          buildUrlSubMenu("Add Practitioner", "/practitioner/personal"),
          buildUrlSubMenu("Add Group", "/group/profile"),
          buildUrlSubMenu("Add Facility", "/facility/demographics"),
        ],
      }),
    ],
  },
  {
    portalName,
    product: "Manage",
    menuList: [
      buildMenu("Manage", {
        hasLink: "Yes",
        linkType: "subMenu",
        hasSubmenu: "Yes",
        subMenuList: [
          buildUrlSubMenu("Welcome Packets", "/welcomepacket/welcome"),
        ],
      }),
    ],
  },
  {
    portalName,
    product: "Recent",
    menuList: [buildMenu("Recent")],
  },
];