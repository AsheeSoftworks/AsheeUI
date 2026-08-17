declare module "virtual:ashee-config" {
  import type { ExternalConfig } from "./config";

  const config: ExternalConfig | undefined;
  export default config;
}
