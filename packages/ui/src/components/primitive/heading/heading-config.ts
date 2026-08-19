import type {
  FontWeight,
  LetterSpacing,
  LineHeight,
} from "../../../theme/typography/typography-config";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingConfig {
  level?: HeadingLevel;
  weight?: keyof FontWeight;
  lineHeight?: keyof LineHeight;
  letterSpacing?: keyof LetterSpacing;
  className?: string;
}

export const defaultHeadingConfig: HeadingConfig = {
  level: 1,
};

export const FALLBACK_HEADING_CONFIG = {
  level: 1,
  weight: "bold",
  lineHeight: "short",
  letterSpacing: "tight",
} as const;
