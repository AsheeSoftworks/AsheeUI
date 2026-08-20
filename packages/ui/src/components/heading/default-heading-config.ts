import type { HeadingLevel } from "./heading-config";

export interface HeadingLevelStyle {
  fontSize: { base: string; lg?: string };
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

export const defaultHeadingConfig: Record<HeadingLevel, HeadingLevelStyle> = {
  1: {
    fontSize: { base: "2.25rem", lg: "2.5rem" },
    fontWeight: "bold",
    lineHeight: "short",
    letterSpacing: "tight",
  },
  2: {
    fontSize: { base: "1.875rem", lg: "2rem" },
    fontWeight: "bold",
    lineHeight: "short",
    letterSpacing: "tight",
  },
  3: {
    fontSize: { base: "1.5rem" },
    fontWeight: "semibold",
    lineHeight: "short",
    letterSpacing: "normal",
  },
  4: {
    fontSize: { base: "1.25rem" },
    fontWeight: "semibold",
    lineHeight: "base",
    letterSpacing: "normal",
  },
  5: {
    fontSize: { base: "1.125rem" },
    fontWeight: "medium",
    lineHeight: "base",
    letterSpacing: "normal",
  },
  6: {
    fontSize: { base: "1rem" },
    fontWeight: "medium",
    lineHeight: "base",
    letterSpacing: "normal",
  },
};
