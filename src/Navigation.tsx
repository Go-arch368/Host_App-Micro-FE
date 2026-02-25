import {
  faBars,
  faCaretDown,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { initialState,navigationReducer } from "./reducers/navigatonReducer";
import styles from "./CSS/navigation.module.scss";

// Define the structure of the navigation data
export interface NavigationData {
  portalName: string;
  application?: string;
  product?: string;
  menuList: MenuItem[];
}

// Define the structure of a menu item
interface MenuItem {
  menuName: string;
  hasLink: string;
  linkType: string;
  linkpath: string;
  hasSubmenu: string;
  eligibleRoleList: string[];
  subMenuList?: SubMenuItem[];
  tagName?: string;
}

// Define the structure of a submenu item
interface SubMenuItem {
  menuName: string;
  hasLink: string;
  linkType: string;
  linkpath: string;
  hasSubmenu: string;
  eligibleRoleList: string[];
  subMenu?: SubMenuItem[];
  tagName?: string;
}

// Props for the Navigation component
interface NavigationProps {
  navigationItems: NavigationData[];
}

const Navigation: React.FC<NavigationProps> = ({ navigationItems }) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);
  const isSmallScreen = window.innerWidth <= 768; // Define small screen width threshold
  let isKeyboardInteraction = false;

  // Get the current URL path
  const currentPath = window.location.pathname;

  // Find active menu item based on the current URL
  useEffect(() => {
    const findMenuNameByLinkPath = (
      navigationItems: NavigationData[],
      currentPath: string,
    ) => {
      const isMenuItem = (item: MenuItem | SubMenuItem): item is MenuItem =>
        "subMenuList" in item;

      const traverseMenu = (menuList: Array<MenuItem | SubMenuItem>) => {
        for (const menuItem of menuList) {
          // Check if the current menu item's linkpath matches the current URL
          if (menuItem.linkpath === currentPath) {
            return menuItem.menuName;
          }
          // If the menu item has a subMenuList, recursively search it
          if (isMenuItem(menuItem) && menuItem.subMenuList) {
            const foundInSubMenu = traverseMenu(menuItem.subMenuList);
            if (foundInSubMenu) {
              return foundInSubMenu;
            }
          }
          // If the menu item has a subMenu, recursively search it
          if ("subMenu" in menuItem && menuItem.subMenu) {
            const foundInSubMenu = traverseMenu(menuItem.subMenu);
            if (foundInSubMenu) {
              return foundInSubMenu;
            }
          }
        }
        return null; // Return null if no match is found
      };
      for (const navItem of navigationItems) {
        const found = traverseMenu(navItem.menuList);
        if (found) {
          return found;
        }
      }
      return null; // Return null if no match is found in the entire navigationItems
    };

    setSelectedMenu(findMenuNameByLinkPath(navigationItems, currentPath));
  }, [currentPath]);

  // // Handle clicks outside the navigation to reset all states
  const handleClickOutside = (event: MouseEvent) => {
    const navClassName = `.${styles["navigation-section"]}`;
    const navElement = document.querySelector(navClassName);
    if (navElement && !navElement.contains(event.target as Node)) {
      dispatch({ type: "RESET_ALL" }); // Close all menus
    }
  };

  // // Add and remove event listeners for clicks outside the navigation
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle hover events for menus
  const handleMenuHover = (key: string) => {
    dispatch({ type: "OPEN_MENU", key: key });
  };
  const handleMenuHoverOut = (key: string) => {
    if (!isSmallScreen) {
      dispatch({ type: "CLOSE_MENU", key: key });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isCurrentlySmallScreen = window.innerWidth <= 768;
      if (isCurrentlySmallScreen !== isSmallScreen) {
        dispatch({ type: "RESET_ALL" }); // Close all menus
        setHamburgerOpen(false); // Close hamburger menu if open
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSmallScreen]);

  // Render submenu items
  const renderSubMenu = (subMenuList: SubMenuItem[], parentKey: string) => {
    return (
      <ul
        className={`${styles["subMenu-items-child"]} ${state.openSubMenus[parentKey] ? "" : styles["hidden"]}`}
        role="subMenu-items"
      >
        {subMenuList.map((subMenuItem, subIndex) => {
          const subMenuKey = `${parentKey}-${subIndex}`;

          if (subMenuItem.hasSubmenu.toLowerCase() === "no") {
            return (
              <li key={subMenuKey} className={styles[`subMenu-item`]}>
                <Link
                  to={subMenuItem.linkpath}
                  className={` ${selectedMenu === subMenuItem.menuName ? styles["selected"] : ""}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                    }
                  }}
                >
                  {subMenuItem.menuName}
                </Link>
              </li>
            );
          } else
            return (
              <li
                tabIndex={0}
                key={subMenuKey}
                onMouseEnter={(e) => {
                  e.currentTarget.focus();
                  if (!isSmallScreen) {
                    dispatch({ type: "OPEN_SUBMENU_CHILD", key: subMenuKey });
                  }
                }}
                onMouseLeave={() => {
                  if (!isSmallScreen) {
                    dispatch({ type: "CLOSE_SUBMENU_CHILD", key: subMenuKey });
                  }
                }}
                onClick={() => {
                  dispatch({ type: "TOGGLE_SUBMENU_CHILD", key: subMenuKey });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    dispatch({ type: "TOGGLE_SUBMENU_CHILD", key: subMenuKey });
                  }
                }}
              >
                <div className="text">
                  {subMenuItem.menuName}
                  {subMenuItem.hasSubmenu.toLowerCase() === "yes" &&
                    (isSmallScreen ? (
                      <FontAwesomeIcon icon={faCaretDown} />
                    ) : (
                      <FontAwesomeIcon icon={faCaretRight} />
                    ))}
                </div>

                {subMenuItem.hasSubmenu.toLowerCase() === "yes" &&
                  renderSubMenu(subMenuItem.subMenu || [], subMenuKey)}
              </li>
            );
        })}
      </ul>
    );
  };

  // Render main menu items
  const renderMenu = (menuList: MenuItem[] | SubMenuItem[], parentKey = "") =>
    menuList.map((menuItem, index) => {
      const currentKey = `${parentKey}-${index}`;
      if (menuItem.hasSubmenu.toLowerCase() === "no") {
        return (
          <li
            key={currentKey}
            className={styles[`navigation-item`]}
            role="menuitem"
            data-testid="navigation-item"
          >
            <Link
              to={menuItem.linkpath}
              className={` ${selectedMenu === menuItem.menuName ? styles["selected"] : ""}`}
            >
              {menuItem.menuName}
            </Link>
          </li>
        );
      } else {
        return (
          <li
            tabIndex={0}
            key={currentKey}
            className={styles[`navigation-item`]}
            data-testid="navigation-item"
            onMouseEnter={(e) => {
              e.stopPropagation();
              handleMenuHover(currentKey);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.blur();
              handleMenuHoverOut(currentKey);
            }}
            onClick={(e) => {
              isKeyboardInteraction = false;
              e.stopPropagation();
              e.currentTarget.focus();
              if (!isSmallScreen && !state.openMenus[currentKey]) {
                dispatch({ type: "TOGGLE_MENU", key: currentKey });
              }
            }}
            onKeyDown={(e) => {
              isKeyboardInteraction = true;
              if (e.key === "Enter") {
                dispatch({ type: "TOGGLE_MENU", key: currentKey });
              }
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                if (isKeyboardInteraction) {
                  // Handle keyboard-specific blur logic
                  dispatch({ type: "CLOSE_MENU", key: currentKey });
                } else {
                  // Handle mouse-specific blur logic
                  handleMenuHoverOut(currentKey);
                }
              }
            }}
          >
            <div className="text">
              {menuItem.menuName} &nbsp;
              {menuItem.hasSubmenu.toLowerCase() === "yes" && (
                <FontAwesomeIcon icon={faCaretDown} />
              )}
            </div>

            {menuItem.hasSubmenu.toLowerCase() === "yes" && (
              <ul
                className={`${styles["subMenu-items"]} ${state.openMenus[currentKey] ? "" : styles["hidden"]}`}
                role="subMenu-items"
                data-testid="subMenu-item"
              >
                {menuItem.subMenuList.map((subMenuItem, subIndex) => {
                  const subMenuKey = `${currentKey}-${subIndex}`;
                  if (subMenuItem.hasSubmenu.toLowerCase() === "no") {
                    return (
                      <li
                        key={subMenuKey}
                        role="subMenuItem"
                        onClick={() => {
                          //e.preventDefault();
                        }}
                      >
                        <Link
                          to={subMenuItem.linkpath}
                          className={` ${selectedMenu === subMenuItem.menuName ? styles["selected"] : ""}`}
                        >
                          {subMenuItem.menuName}
                        </Link>
                      </li>
                    );
                  } else {
                    return (
                      <li
                        tabIndex={0}
                        aria-expanded={
                          state.openSubMenus[subMenuKey] ? "true" : "false"
                        }
                        key={subMenuKey}
                        onClick={(e) => {
                          dispatch({ type: "TOGGLE_SUBMENU", key: subMenuKey });
                          e.currentTarget.focus();
                        }}
                        onMouseEnter={() => {
                          if (!isSmallScreen) {
                            dispatch({ type: "OPEN_SUBMENU", key: subMenuKey });
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isSmallScreen) {
                            dispatch({
                              type: "CLOSE_SUBMENU",
                              key: subMenuKey,
                            });
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            dispatch({
                              type: "TOGGLE_SUBMENU",
                              key: subMenuKey,
                            });
                          }
                        }}
                      >
                        <div className="text">
                          {subMenuItem.menuName}
                          {subMenuItem.hasSubmenu.toLowerCase() === "yes" &&
                            (isSmallScreen ? (
                              <FontAwesomeIcon icon={faCaretDown} />
                            ) : (
                              <FontAwesomeIcon icon={faCaretRight} />
                            ))}
                        </div>

                        {subMenuItem.hasSubmenu.toLowerCase() === "yes" &&
                          renderSubMenu(subMenuItem.subMenu || [], subMenuKey)}
                      </li>
                    );
                  }
                })}
              </ul>
            )}
          </li>
        );
      }
    });

  return (
    <>
      <nav className={styles.navigation}>
        <FontAwesomeIcon
          icon={faBars}
          onClick={() => setHamburgerOpen(!hamburgerOpen)}
          className={styles["hamburger"]}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
              setHamburgerOpen(!hamburgerOpen);
            }
          }}
        />
        <ul
          className={`${styles["navigation-section"]} ${hamburgerOpen ? "" : styles["hidden"]}`}
        >
          {navigationItems.map((navItem, navIndex) =>
            renderMenu(navItem.menuList, `menu-${navIndex}`),
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;