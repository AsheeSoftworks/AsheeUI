/**
 * `Dropdown`, the name this component is documented and taught under.
 *
 * The component has been exported as `Dropmenu` since the 1.0.0 rename, and the documentation now calls it a
 * dropdown — the word a reader looks for. The two names are one component: the same control, the same props
 * and the same configuration section (`components.dropmenu`, because a module name is not a component name),
 * so neither is a fork of the other and code written against either keeps working.
 *
 * @example
 * ```tsx
 * import { Dropdown } from "@asheeui/native";
 *
 * const speeds = [
 *   { label: "Standard", value: "standard" },
 *   { label: "Express", value: "express" },
 * ];
 *
 * <Dropdown label="Delivery speed" options={speeds} value={speed} onValueChange={setSpeed} />;
 * ```
 *
 * @see Dropmenu - The component this alias names.
 * @see DropdownProps - The props type, the same shape as `DropmenuProps`.
 */
import { Dropmenu } from "./Dropmenu";

export type { DropmenuProps as DropdownProps } from "./Dropmenu";

/**
 * The select component, under the name the documentation uses.
 *
 * It is the same component as {@link Dropmenu}, not a second implementation: its control, its props, its
 * behaviour and its configuration section are that component's.
 */
export const Dropdown = Dropmenu;
