import type { ExternalConfig } from "asheeui";

/**
 * The playground's configuration, in the shape a consumer's `asheeui.config.ts`
 * has.
 */
export const playgroundConfig: ExternalConfig = {
  defaultTheme: "system",
  defaultVariant: "solid",
  defaultColor: "primary",
  defaultRadius: "md",
  components: {
    button: { variant: "solid" },
  },
};
