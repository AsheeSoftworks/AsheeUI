export type Spacing = {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
};

export interface SpacingConfig {
  default: keyof Spacing;
  values: Spacing;
}
