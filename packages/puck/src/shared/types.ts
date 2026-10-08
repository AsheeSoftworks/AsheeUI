/**
 * The vocabulary the two halves of the Puck integration share.
 *
 * A page composed in a visual builder has to mean the same thing on the web and on a
 * device. What makes that true is that the two renderers read one description of a
 * block: the same fields, the same default values, the same label and the same
 * category. Those descriptions live here, and the types in this module are what the
 * shared block specs and both renderers are written against.
 *
 * The module is deliberately free of two dependencies rather than one. It imports no
 * renderer — that is what makes it shared — and it imports nothing from
 * `@puckeditor/core`, because that package is a DOM editor and the native entry has to
 * be loadable, and type-checkable, without it. The field types below are this
 * package's own, structurally the field types a builder understands: `type` is the
 * discriminator and the rest is the data a form control needs. The web registry
 * asserts once, where it assembles its `Config`, that they describe the same fields —
 * which is the single place the two descriptions meet.
 */

import type { ReactNode } from "react";

/**
 * A single line of text.
 */
export interface AsheeTextField {
  /** The builder draws this as a text input. */
  type: "text";

  /** Label shown in the builder. */
  label: string;

  /** Placeholder shown in the empty field. */
  placeholder?: string;
}

/**
 * Several lines of text.
 */
export interface AsheeTextareaField {
  /** The builder draws this as a text area. */
  type: "textarea";

  /** Label shown in the builder. */
  label: string;

  /** Placeholder shown in the empty field. */
  placeholder?: string;
}

/**
 * One of a fixed set of values.
 */
export interface AsheeSelectField {
  /** The builder draws this as a select control. */
  type: "select";

  /** Label shown in the builder. */
  label: string;

  /** The values the field offers. */
  options: Array<{ label: string; value: string }>;
}

/**
 * One of a small set of values, drawn as a radio group.
 *
 * A radio field is what a boolean is expressed with, because a builder's radio
 * control holds the value itself rather than a string spelling of it.
 */
export interface AsheeRadioField {
  /** The builder draws this as a radio group. */
  type: "radio";

  /** Label shown in the builder. */
  label: string;

  /** The values the field offers. */
  options: Array<{ label: string; value: string | number | boolean }>;
}

/**
 * A drop zone: where the builder lets a reader put other blocks.
 */
export interface AsheeSlotField {
  /** The builder draws this as a drop zone. */
  type: "slot";

  /** Label shown in the builder. */
  label: string;
}

/**
 * A repeatable list of items, with its item type erased.
 *
 * This is the form the field union holds: a registry keeps fields of different item
 * shapes in one object, so the collection's type has to state what every list has in
 * common — the nested fields, the starting row and the summary — without naming an item.
 * `AsheeArrayField` is the form a block writes, where the item type is known.
 */
export interface AsheeArrayFieldBase {
  /** The builder draws this as a list with an add control. */
  type: "array";

  /** Label shown in the builder. */
  label: string;

  /** The fields of one item. */
  arrayFields: Record<string, AsheeField>;

  /** The item a new row starts as. */
  defaultItemProps?: unknown;

  /** The one line that summarises an item in the closed list. */
  getItemSummary?: (item: never) => string;
}

/**
 * A repeatable list of items.
 *
 * @typeParam Item - The shape of one item, which `arrayFields` describes field by
 * field.
 */
export interface AsheeArrayField<Item = Record<string, unknown>>
  extends Omit<AsheeArrayFieldBase, "defaultItemProps" | "getItemSummary"> {
  /** The item a new row starts as. */
  defaultItemProps?: Partial<Item>;

  /** The one line that summarises an item in the closed list. */
  getItemSummary?: (item: Item) => string;
}

/**
 * A fixed group of fields.
 */
export interface AsheeObjectField {
  /** The builder draws this as a nested group of controls. */
  type: "object";

  /** Label shown in the builder. */
  label: string;

  /** The fields of the group. */
  objectFields: Record<string, AsheeField>;
}

/**
 * Every field type the AsheeUI blocks use.
 */
export type AsheeField =
  | AsheeTextField
  | AsheeTextareaField
  | AsheeSelectField
  | AsheeRadioField
  | AsheeSlotField
  | AsheeArrayFieldBase
  | AsheeObjectField;

/**
 * A block's visual configuration, stated once for both renderers.
 *
 * The three members are exactly the part of a block that cannot differ between
 * platforms: a label a builder shows, the fields it fills in, and the value it starts
 * with. The render function is deliberately absent — that is the one part the platform
 * owns — and the two platform registries add it.
 *
 * `fields` is keyed by name rather than tied to the prop type. A drop zone names a key
 * whose value is not part of the component's own props on either platform (the web
 * passes a `SlotComponent`, the platform passes rendered children), so the linked form
 * would be untruthful for exactly the blocks where the two differ most.
 *
 * @typeParam TProps - The props the block's render function receives.
 */
export interface AsheeBlockSpec<TProps> {
  /** Name of the block in the builder's block list. */
  label: string;

  /** The fields the builder fills in. */
  fields: Record<string, AsheeField>;

  /** The value a new block starts with. */
  defaultProps: Partial<TProps>;
}

/**
 * A block as a renderer sees it.
 *
 * The render function returns a plain React node rather than a builder's render
 * result, because the same shape has to describe a block to two renderers: the web
 * draws it into a DOM inside the editor's preview and inside a published page, and the
 * platform draws it into a native view when it renders a stored page. On the platform
 * it is handed the block's props with every drop zone already resolved to a rendered
 * node, because a native screen has no editor to resolve one for it.
 *
 * @typeParam TProps - The props the render function receives.
 */
export interface AsheeBlock<TProps> {
  /** Name of the block in the builder's block list. */
  label: string;

  /** The fields the block declares, read to find its drop zones. */
  fields: Record<string, AsheeField>;

  /** The value the block resolves when a stored page omits a key. */
  defaultProps?: Partial<TProps>;

  /** Draw the block. */
  render: (props: TProps) => ReactNode;
}

/**
 * One category of the builder's block list.
 */
export interface AsheePuckCategoryDefinition {
  /** Heading the builder shows for the category. */
  title: string;

  /** The blocks filed under it. */
  components: string[];
}

/**
 * The categories a block can be filed under, by key.
 */
export type AsheePuckCategories = Record<string, AsheePuckCategoryDefinition>;

/**
 * The page shell a stored page renders into.
 */
export interface AsheePuckRootProps {
  /** The page the builder composed. */
  children?: ReactNode;
}

/**
 * The native registry: every block, the categories they are filed under, and the page
 * shell a stored page renders into.
 */
export interface AsheeNativePuckConfig {
  /** The blocks, by the name a stored page names them with. */
  components: Record<string, AsheeBlock<never>>;

  /** The categories the blocks are filed under. */
  categories: AsheePuckCategories;

  /** The page shell every stored page renders into. */
  root: AsheeBlock<AsheePuckRootProps>;
}

/**
 * One block in a stored page.
 *
 * The shape is the builder's own serialized document, and it is described here rather
 * than imported so that reading a stored page needs nothing from the editor. A drop
 * zone's children are stored under the zone's own key in `props`, which is why `props`
 * is an open record: the renderer reads a zone by name.
 */
export interface AsheePuckBlockData {
  /** The block's name, which is the key it is registered under. */
  type: string;

  /** The value the editor stored for the block, including its drop zones. */
  props: Record<string, unknown>;
}

/**
 * A stored page, as the editor publishes it.
 *
 * Only the members a renderer reads are stated. A published document carries more — a
 * history, a set of zones — and a renderer that ignored them would be right to: this
 * is the contract a page is *rendered* from.
 */
export interface AsheePuckData {
  /** The page's outer value, which the page shell may read. */
  root?: { props?: Record<string, unknown> };

  /** The blocks of the page, in order. */
  content: AsheePuckBlockData[];
}
