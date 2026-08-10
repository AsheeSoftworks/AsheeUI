import type { FontWeight, LineHeight, Size } from "@ashee/theme";

export interface ParagraphConfig {
  size?: keyof Size;
  weight?: keyof FontWeight;
  lineHeight?: keyof LineHeight;
  className?: string;
}
