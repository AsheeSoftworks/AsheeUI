export type Radius = {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  full: string;
};

export interface RadiusConfig {
  default: keyof Radius;
  values: Radius;
}
