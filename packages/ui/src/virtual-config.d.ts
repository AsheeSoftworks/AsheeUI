declare module "virtual:ashee-config" {
  const config: import("./config/config").ExternalConfig | undefined;
  export default config;
}
