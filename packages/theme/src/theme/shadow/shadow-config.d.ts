export type Shadow = {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
};

export interface ShadowConfig {
  default: keyof Shadow;
  values: Shadow;
}
