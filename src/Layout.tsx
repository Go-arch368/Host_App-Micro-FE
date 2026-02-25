





import { Outlet, useNavigate } from "react-router-dom";
import logo from "./assets/images/Claritev-Logo.png";
import { Header, Footer } from "portal-chassis-sl";
import { useOktaAuth } from "@okta/okta-react";
import Navigation from "./Navigation";
import { NavigationItems } from "./NavigationData";

const Layout = () => {
  const { authState } = useOktaAuth();
  const navigate = useNavigate();

  const firstName = authState?.idToken?.claims?.given_name ?? "";
  const lastName = authState?.idToken?.claims?.family_name ?? "";
  const fallbackName = authState?.idToken?.claims?.name;
  const userName =
    [firstName, lastName].filter(Boolean).join(" ") || fallbackName || "User";

  const handleLogout = () => {
    navigate("/logout", { replace: true });
  };

  return (
    <div className="app-shell">
      <div className="header">
        <Header
          logoLink={logo}
          logoAltText="Claritev Logo"
          headerTitle="ProLink"
          userName={userName}
          headerWelcomeText="Hi"
          showUserNameStamp={true}
          onLogout={() => {
            handleLogout();
          }}
        />
        <Navigation navigationItems={NavigationItems} />
      </div>

      <main className="app-shell-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;