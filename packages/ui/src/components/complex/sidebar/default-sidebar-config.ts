import type { SidebarConfig, SidebarSizeScale } from "./sidebar-config";

export const defaultSidebarSizeScale: SidebarSizeScale = {
  default: "md",
  values: {
    sm: {
      expandedWidth: { base: "14rem" },
      collapsedWidth: { base: "4rem" },
      headerHeight: { base: "3rem" },
      itemHeight: { base: "2.25rem" },
      paddingInline: { base: "0.5rem" },
      fontSize: { base: "0.8125rem" },
    },
    md: {
      expandedWidth: { base: "16rem" },
      collapsedWidth: { base: "4.5rem" },
      headerHeight: { base: "3.5rem" },
      itemHeight: { base: "2.75rem" },
      paddingInline: { base: "0.75rem" },
      fontSize: { base: "0.875rem" },
    },
    lg: {
      expandedWidth: { base: "18rem" },
      collapsedWidth: { base: "5rem" },
      headerHeight: { base: "4rem" },
      itemHeight: { base: "3.25rem" },
      paddingInline: { base: "1rem" },
      fontSize: { base: "1rem" },
    },
  },
};

export const defaultSidebarConfig: SidebarConfig = {
  size: defaultSidebarSizeScale,
  variant: "default",
  radius: "none",
  animation: "fade",
};
