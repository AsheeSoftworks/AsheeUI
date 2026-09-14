import type { ExternalConfig } from "asheeui";

/**
 * The consumer configuration file the documentation describes, at the project
 * root of a Next.js application.
 *
 * It is imported by the root layout, and it carries a per-component override so
 * the playground also proves the component-level tier of the configuration
 * cascade in a Next.js build.
 */
export const config: ExternalConfig = {
  defaultTheme: "system",
  defaultVariant: "solid",
  defaultColor: "primary",
  defaultRadius: "md",
  components: {
    button: { variant: "solid" },
  },
};

export default config;
