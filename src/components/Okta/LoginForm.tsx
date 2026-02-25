import React, { useState, useEffect } from "react";
import styles from "../../CSS/LoginForm.module.scss";
import "../../CSS/main.scss";
import Constants from "../../utils/Constants";
import { useOktaAuth } from "@okta/okta-react";
import type { AuthnTransaction } from "@okta/okta-auth-js";
import { Footer, Header } from "portal-chassis-sl";
import "portal-chassis-sl/dist/portal-chassis-sl.css";
import claritevLogo from "../../assets/images/Claritev-Logo.png";
import oktaLoginConfig from "./OktaLoginConfig";

interface props {
  getUserProfile?: (profile: UserProfile) => void;
}

type SlotStyles = {
  root?: React.CSSProperties;
  main?: React.CSSProperties;
  logo?: React.CSSProperties;
  img?: React.CSSProperties;
  title?: React.CSSProperties;
  right?: React.CSSProperties;
};

type UserProfile = Record<string, unknown>;

const LoginForm: React.FC<props> = (props) => {
  const { oktaAuth } = useOktaAuth();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const headerSlotStyles: SlotStyles = {
    main: { width: "100%", justifyContent: "flex-start" },
    logo: { alignItems: "flex-end" },
    img: { marginRight: "0.75rem" },
    title: { marginLeft: "0.5rem", verticalAlign: "bottom" },
  };

  useEffect(() => {
    const fetchToken = async () => {
      if (sessionStorage.getItem("logout") !== "true") {
        try {
          const res = await oktaAuth.token.getWithoutPrompt();

          if (res.tokens) {
            oktaAuth.tokenManager.setTokens(res.tokens);
            setIsAuthenticated(true);
            window.location.replace(oktaLoginConfig.redirectUrl);
            return;
          }

          setIsAuthenticated(false);
        } catch (err) {
          console.error("Error getting token:", err);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    fetchToken();
  }, [oktaAuth, oktaLoginConfig.redirectUrl]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrMsg(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const data = {
      username: email,
      password: password,
    };

    oktaAuth
      .signInWithCredentials(data)
      .then((res: AuthnTransaction) => {
        if (res.status === "LOCKED_OUT") {
          setErrMsg(
            "Your account is locked. Please contact your administrator.",
          );
          return;
        }
        const token = res.sessionToken;
        const userProfile = res.user?.profile as UserProfile;
        props.getUserProfile?.(userProfile);
        if (!token) {
          throw new Error("authentication process failed");
        }
        setSessionToken(token);
        oktaAuth.signInWithRedirect({
          originalUri: oktaLoginConfig.redirectUrl,
          sessionToken: token,
        });
      })
      .catch(() => {
        setErrMsg("Invalid UserName or password !");
      });
  };

  if (isAuthenticated === null) {
    return <div>Loading....</div>; // Show a loading message or spinner while checking authentication
  }
  if (sessionToken) return <div />;

  return (
    <>
      <div className="container-fluid d-flex flex-column vh-100">
        <Header
          headerTitle={"ProLink Sign In"}
          logoLink={claritevLogo}
          logoAltText={"Claritev Logo"}
          userName={""}
          showUserNameStamp={false}
          slotStyles={headerSlotStyles}
        />

        <main className={`${styles.container} p-3`}>
          <div className="pt-md-2 d-flex justify-content-between row">
            <div className={` mb-4 col-lg-5 col-md-7`}>
              {errMsg && <p className={styles.errMsgStyle}>{errMsg}</p>}
              <div
                className={`bg-light border-secondary border rounded-5  flow p-125`}
              >
                <form onSubmit={handleSubmit} className={styles.form}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    data-testid="testid-email"
                    autoFocus
                    required={true}
                  />
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    data-testid="testid-password"
                    required={true}
                  />
                  <button type="submit" className={styles.button}>
                    Sign In
                  </button>
                </form>
              </div>
            </div>

            <div className={` ${styles.instructions} col-lg-6 col-md-5`}>
              <h4>{Constants.WELCOME_MSG}</h4>
              <div>
                <p>{Constants.SIGNIN_MSG}</p>
                <p>{Constants.CONTACT_MSG}</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LoginForm;