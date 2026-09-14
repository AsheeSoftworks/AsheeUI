import type { ExternalConfig } from "asheeui";

/**
 * The playground's configuration, in the shape a consumer's `asheeui.config.ts`
 * has.
 *
 * It is imported by the application rather than loaded from the file system,
 * because the playground is bundled: the values are the ones a consumer would
 * write, including a per-component override.
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
