// import {
//   HOST_OKTA_CLIENT_ID,
//   HOST_OKTA_ISSUER_URI,
//   HOST_OKTA_CLIENT_ORIGIN,
// } from "../../config/env";

import {
    HOST_OKTA_CLIENT_ID,
    HOST_OKTA_ISSUER_URI,
    HOST_OKTA_CLIENT_ORIGIN
} from "../../config/env"

export interface OktaLoginConfig {
  clientId: string;
  callBackUrl: string;
  loginUrl: string;
  redirectUrl: string;
  uri: string;
}

export const oktaLoginConfig: OktaLoginConfig = {
  clientId: HOST_OKTA_CLIENT_ID,
  callBackUrl: `${HOST_OKTA_CLIENT_ORIGIN}/login/callback`,
  loginUrl: `${HOST_OKTA_CLIENT_ORIGIN}/login`,
  redirectUrl: `${HOST_OKTA_CLIENT_ORIGIN}/lookup/search`,
  uri: HOST_OKTA_ISSUER_URI,
};

export default oktaLoginConfig;