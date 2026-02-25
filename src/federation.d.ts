type NavigationContextValue =
  import("./navigation/NavigationContext").NavigationContextValue;

type RemoteAppProps = {
  navigationContext: NavigationContextValue;
};

type RemoteAppComponent = import("react").ComponentType<RemoteAppProps>;

declare module "prolink_lookup_remote/App" {
  const Component: RemoteAppComponent;
  export default Component;
}

declare module "welcomepacket/App" {
  const Component: RemoteAppComponent;
  export default Component;
}

declare module "practitioner/App" {
  const Component: RemoteAppComponent;
  export default Component;
}

declare module "facility/App" {
  const Component: RemoteAppComponent;
  export default Component;
}

declare module "group/App" {
  const Component: RemoteAppComponent;
  export default Component;
}

declare module "corporateentity/App" {
  const Component: RemoteAppComponent;
  export default Component;
}