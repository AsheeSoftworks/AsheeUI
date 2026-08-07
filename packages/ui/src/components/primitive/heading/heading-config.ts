import type { FontWeight, LetterSpacing, LineHeight } from "@ashee/config";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingLevelStyle {
  fontSize: string;
  fontWeight: keyof FontWeight;
  lineHeight: keyof LineHeight;
  letterSpacing: keyof LetterSpacing;
}

export interface HeadingConfig {
  levels?: Record<HeadingLevel, HeadingLevelStyle>;
  className?: string;
}
