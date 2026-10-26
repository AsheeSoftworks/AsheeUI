/**
 * The native Sidebar's collapse state, published to the control the application draws.
 *
 * The column used to draw that control itself, in its footer: a button labelled "Collapse" that only the
 * framework's taste could style. A control belongs to the application that places it — the column's footer, a
 * header, a workspace switcher — so the column now states its state and the application presses its own
 * `Pressable`. This module is the seam: `Sidebar` provides the state, `useSidebarCollapse` reads it, and the
 * consumer's control calls it.
 *
 * A control outside the column's own tree cannot read the context and does not need to: `isCollapsed` and
 * `onCollapseChange` on the `Sidebar` are the controlled form, and a control in a header drives those.
 */

import { createContext, useContext } from "react";

/**
 * What a control needs to know to fold and unfold a sidebar.
 *
 * `collapsible` is reported so a control can be disabled rather than offering an action the column refuses;
 * `setCollapsed` is for a control that states a position and `toggleCollapse` for one that flips it.
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
 * state by hand, for example to move the control into a shared screen header; `useSidebarCollapse` is the
 * documented way to read it.
 */
export const SidebarCollapseContext = createContext<SidebarCollapse | null>(
  null,
);

/** Whether the missing-provider warning has already been printed. */
let hasWarnedAboutMissingSidebar = false;

/**
 * The state a sidebar publishes, for the control that folds it.
 *
 * Call it from a component rendered inside the column — its `footer` slot is the usual place — and draw
 * whatever control fits the product. The column reports `collapsible`, so a control can stay quiet when the
 * column cannot fold, and `accessibilityState` reads from `isCollapsed`.
 *
 * Outside a `Sidebar` the hook does not throw, because a lost control must not take the screen down: it warns
 * once in development and reports a state that cannot move, so the control renders disabled instead of
 * pretending to work.
 *
 * @returns The column's collapse state and the two actions that change it.
 *
 * @example
 * ```tsx
 * import { Pressable, Text } from "react-native";
 * import { Sidebar, useSidebarCollapse } from "@asheeui/native";
 *
 * function CollapseButton() {
 *   const { isCollapsed, collapsible, toggleCollapse } = useSidebarCollapse();
 *
 *   return (
 *     <Pressable
 *       accessibilityRole="button"
 *       accessibilityLabel={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
 *       accessibilityState={{ expanded: !isCollapsed, disabled: !collapsible }}
 *       disabled={!collapsible}
 *       onPress={toggleCollapse}>
 *       <Text>{isCollapsed ? "Expand" : "Collapse"}</Text>
 *     </Pressable>
 *   );
 * }
 *
 * <Sidebar items={items} title="Ashee CRM" footer={<CollapseButton />} />;
 * ```
 *
 * @example
 * ```tsx
 * // The control lives in the screen's header instead, so the state is lifted.
 * const [collapsed, setCollapsed] = useState(false);
 *
 * <Button onPress={() => setCollapsed((value) => !value)}>Toggle navigation</Button>
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
