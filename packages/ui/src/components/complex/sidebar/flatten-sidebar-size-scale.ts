import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";
import type { SidebarSizeScale } from "./sidebar-config";

export function flattenSidebarSizeScale(
  scale: SidebarSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-sidebar-${key}-expanded-w`] = v.expandedWidth;
    vars[`--ashee-sidebar-${key}-collapsed-w`] = v.collapsedWidth;
    vars[`--ashee-sidebar-${key}-header-h`] = v.headerHeight;
    vars[`--ashee-sidebar-${key}-item-h`] = v.itemHeight;
    vars[`--ashee-sidebar-${key}-px`] = v.paddingInline;
    vars[`--ashee-sidebar-${key}-font-s`] = v.fontSize;
  }
  return vars;
}
