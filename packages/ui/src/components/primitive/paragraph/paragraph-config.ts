import type { FontWeight, LineHeight, Size } from "@ashee/config";

export interface ParagraphConfig {
  size?: keyof Size;
  weight?: keyof FontWeight;
  lineHeight?: keyof LineHeight;
  className?: string;
}
