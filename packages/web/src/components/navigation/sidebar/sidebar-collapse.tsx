/**
 * The Sidebar's collapse state, published to the control the application draws.
 *
 * The column used to draw that control itself, in its footer: a button named "Collapse sidebar" that only the
 * framework's taste could style. A control belongs to the application that places it — it may sit in the
 * column's footer, in a navbar, or beside a workspace switcher — so the column now states its state and the
 * application draws the button. This module is the seam: `Sidebar` provides the state, `useSidebarCollapse`
 * reads it, and the consumer's own control calls it.
 *
 * A control outside the column's own tree cannot read the context, and does not need to: `isCollapsed` and
 * `onCollapseChange` on the `Sidebar` are the controlled form, and a button in a navbar drives those.
 */
"use client";

import { createContext, useContext } from "react";

/**
 * What a control needs to know to fold and unfold a sidebar.
 *
 * `collapsible` is reported so a control can be disabled rather than offering an action the column refuses;
 * `setCollapsed` is for a control that states a position (a pin, a checkbox) and `toggleCollapse` for one that
 * flips it.
 */
export interface SidebarCollapse {
  /** Whether the column is drawn as its icon rail. */
  isCollapsed: boolean;

  /**
   * Whether the column can fold at all.
   *
   * It is the `collapsible` option after the cascade, so a control can hide or disable itself instead of
   * calling into a column that will not move.
   */
  collapsible: boolean;

  /** Fold or unfold the column. */
  setCollapsed: (collapsed: boolean) => void;

  /** Flip the column between its two states. */
  toggleCollapse: () => void;
}

/**
 * The state a `Sidebar` publishes to its own subtree.
 *
 * It is exported because a consumer that wraps a `Sidebar` in its own component may want to provide the same
 * state by hand, for example to move the control into a shared layout; `useSidebarCollapse` is the documented
 * way to read it.
 */
export const SidebarCollapseContext = createContext<SidebarCollapse | null>(
  null,
);

/** Whether the missing-provider warning has already been printed. */
let hasWarnedAboutMissingSidebar = false;

/**
 * The state a sidebar publishes, for the button that folds it.
 *
 * Call it from a component rendered inside the column — its `footer` slot is the usual place — and build
 * whatever control fits the product. The column reports `collapsible`, so a control can stay quiet when the
 * column cannot fold, and `aria-expanded` reads from `isCollapsed`.
 *
 * Outside a `Sidebar` the hook does not throw, because a lost button must not take the application down: it
 * warns once in development and reports a state that cannot move, so the control renders disabled instead of
 * pretending to work.
 *
 * @returns The column's collapse state and the two actions that change it.
 *
 * @example
 * ```tsx
 * import { Button, Sidebar, useSidebarCollapse } from "@asheeui/web";
 *
 * function CollapseButton() {
 *   const { isCollapsed, collapsible, toggleCollapse } = useSidebarCollapse();
 *
 *   return (
 *     <Button
 *       variant="ghost"
 *       onClick={toggleCollapse}
 *       isDisabled={!collapsible}
 *       aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
 *       {isCollapsed ? "Expand" : "Collapse"}
 *     </Button>
 *   );
 * }
 *
 * <Sidebar items={items} title="Ashee CRM" footer={<CollapseButton />} />;
 * ```
 *
 * @example
 * ```tsx
 * // The control lives in the application's header instead, so the state is lifted.
 * const [collapsed, setCollapsed] = useState(false);
 *
 * <Button onClick={() => setCollapsed((value) => !value)} aria-expanded={!collapsed}>
 *   Toggle navigation
 * </Button>
 * <Sidebar items={items} isCollapsed={collapsed} onCollapseChange={setCollapsed} />;
 * ```
 *
 * @see Sidebar - The column that provides the state.
 * @see SidebarCollapse - The shape the hook returns.
 */
export function useSidebarCollapse(): SidebarCollapse {
  const collapse = useContext(SidebarCollapseContext);

  if (!collapse) {
    if (
      process.env.NODE_ENV !== "production" &&
      !hasWarnedAboutMissingSidebar
    ) {
      hasWarnedAboutMissingSidebar = true;
      console.warn(
        "[AsheeUI] useSidebarCollapse: no Sidebar was found above this component, so the control it builds cannot fold anything. Render it inside the column — its `footer` slot is the usual place — or drive the column with `isCollapsed` and `onCollapseChange` from where the control lives.",
      );
    }

    return INERT_COLLAPSE;
  }

  return collapse;
}

/**
 * What a control gets outside a column: a state that says it cannot move.
 *
 * It is a constant rather than a new object per render so a component that calls the hook in the wrong place
 * does not re-render on every parent render.
 */
const INERT_COLLAPSE: SidebarCollapse = {
  isCollapsed: false,
  collapsible: false,
  setCollapsed: () => {},
  toggleCollapse: () => {},
};
