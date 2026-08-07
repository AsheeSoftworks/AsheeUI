import type { HeadingConfig } from "./heading-config";

export const defaultHeadingConfig: HeadingConfig = {
  levels: {
    1: {
      fontSize: "2.25rem",
      fontWeight: "bold",
      lineHeight: "short",
      letterSpacing: "tight",
    },
    2: {
      fontSize: "1.875rem",
      fontWeight: "bold",
      lineHeight: "short",
      letterSpacing: "tight",
    },
    3: {
      fontSize: "1.5rem",
      fontWeight: "semibold",
      lineHeight: "short",
      letterSpacing: "normal",
    },
    4: {
      fontSize: "1.25rem",
      fontWeight: "semibold",
      lineHeight: "base",
      letterSpacing: "normal",
    },
    5: {
      fontSize: "1.125rem",
      fontWeight: "medium",
      lineHeight: "base",
      letterSpacing: "normal",
    },
    6: {
      fontSize: "1rem",
      fontWeight: "medium",
      lineHeight: "base",
      letterSpacing: "normal",
    },
  },
};
