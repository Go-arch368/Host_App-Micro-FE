// Define the state structure for the navigation
interface NavigationState {
  openMenus: { [key: string]: boolean };
  openSubMenus: { [key: string]: boolean };
  openSubmenuChild: { [key: string]: boolean };
}

// Define the actions for the reducer
export type NavigationAction =
  | { type: "TOGGLE_MENU"; key: string }
  | { type: "OPEN_MENU"; key: string }
  | { type: "CLOSE_MENU"; key: string }
  | { type: "TOGGLE_SUBMENU"; key: string }
  | { type: "OPEN_SUBMENU"; key: string }
  | { type: "CLOSE_SUBMENU"; key: string }
  | { type: "TOGGLE_SUBMENU_CHILD"; key: string }
  | { type: "OPEN_SUBMENU_CHILD"; key: string }
  | { type: "CLOSE_SUBMENU_CHILD"; key: string }
  | { type: "RESET_ALL" };

// Initial state for the navigation
export const initialState: NavigationState = {
  openMenus: {},
  openSubMenus: {},
  openSubmenuChild: {},
};

// Reducer function to manage the navigation state
export const navigationReducer = (
  state: NavigationState,
  action: NavigationAction,
): NavigationState => {
  switch (action.type) {
    case "TOGGLE_MENU":
      return {
        openSubMenus: {},
        openSubmenuChild: {},
        openMenus: {
          [action.key]: !state.openMenus[action.key],
        },
      };
    case "OPEN_MENU":
      return {
        openSubMenus: {},
        openSubmenuChild: {},
        openMenus: {
          [action.key]: true,
        },
      };
    case "CLOSE_MENU":
      return {
        openSubMenus: {},
        openSubmenuChild: {},
        openMenus: {
          [action.key]: false,
        },
      };
    case "TOGGLE_SUBMENU":
      return {
        openMenus: { ...state.openMenus },
        openSubmenuChild: {},
        openSubMenus: {
          [action.key]: !state.openSubMenus[action.key],
        },
      };
    case "OPEN_SUBMENU":
      return {
        openMenus: { ...state.openMenus },
        openSubmenuChild: {},
        openSubMenus: {
          [action.key]: true,
        },
      };
    case "CLOSE_SUBMENU":
      return {
        openMenus: { ...state.openMenus },
        openSubmenuChild: {},
        openSubMenus: {
          [action.key]: false,
        },
      };
    case "TOGGLE_SUBMENU_CHILD":
      return {
        ...state,
        openSubmenuChild: {
          ...state.openSubmenuChild,
          [action.key]: !state.openSubmenuChild[action.key],
        },
      };
    case "OPEN_SUBMENU_CHILD":
      return {
        ...state,
        openSubmenuChild: {
          ...state.openSubmenuChild,
          [action.key]: true,
        },
      };
    case "CLOSE_SUBMENU_CHILD":
      return {
        ...state,
        openSubmenuChild: {
          ...state.openSubmenuChild,
          [action.key]: false,
        },
      };
    case "RESET_ALL":
      return initialState;
    default:
      return state;
  }
};

