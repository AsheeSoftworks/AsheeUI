/**
 * Rendering a stored page, on the platform.
 *
 * A device has no editor, so what it needs from a published document is a renderer:
 * walk the blocks the editor stored, resolve each drop zone into the nodes that belong
 * there, and draw each block through the registry the two platforms share. That is all
 * this is — the platform's counterpart of the editor's own `Render`, which is why the
 * two entries export a component of the same name and an application calls one.
 *
 * Two properties are worth stating. A block the registry does not know is dropped rather
 * than thrown on, because a page saved by a newer editor should not crash an older
 * application. And a key the document omits resolves to the block's default value, so a
 * partial payload — a page saved before a field existed — renders the same way the
 * editor would have shown it.
 */

import { Fragment, type ReactNode } from "react";
import type {
  AsheeBlock,
  AsheeNativePuckConfig,
  AsheePuckBlockData,
  AsheePuckData,
} from "../shared";
import { asheeNativePuckConfig } from "./config";

/**
 * Render a list of blocks.
 *
 * @param content - The blocks, in order.
 * @param config - The registry to render them with.
 * @param keyPrefix - A prefix that keeps a nested block's key unique among its siblings.
 * @returns The rendered blocks.
 */
function renderBlocks(
  content: AsheePuckBlockData[],
  config: AsheeNativePuckConfig,
  keyPrefix: string,
): ReactNode[] {
  return content.map((item, index) =>
    renderBlock(item, config, `${keyPrefix}-${index}`),
  );
}

/**
 * Render one block, resolving its drop zones first.
 *
 * @param item - The block as the document stored it.
 * @param config - The registry to render it with.
 * @param key - A key unique among the block's siblings.
 * @returns The rendered block, or null when the registry does not know its type.
 */
function renderBlock(
  item: AsheePuckBlockData,
  config: AsheeNativePuckConfig,
  key: string,
): ReactNode {
  const block = config.components[item.type] as
    | AsheeBlock<Record<string, unknown>>
    | undefined;

  if (!block) return null;

  const props: Record<string, unknown> = {
    ...block.defaultProps,
    ...item.props,
  };

  // A drop zone's children are stored under the zone's own key, so the fields are what
  // says which keys hold blocks rather than values.
  for (const [name, field] of Object.entries(block.fields ?? {})) {
    if (field?.type !== "slot") continue;

    const children = item.props?.[name];
    props[name] = renderBlocks(
      Array.isArray(children) ? (children as AsheePuckBlockData[]) : [],
      config,
      `${key}-${name}`,
    );
  }

  return <Fragment key={key}>{block.render(props)}</Fragment>;
}

/**
 * Props of {@link PuckPage}.
 */
export interface PuckPageProps {
  /** The page the builder published. */
  data: AsheePuckData;

  /** The registry to render it with. Defaults to the AsheeUI configuration. */
  config?: AsheeNativePuckConfig;
}

/**
 * Render a stored page.
 *
 * @param props - The stored page, and optionally the registry to render it with.
 * @returns The rendered page.
 *
 * @example
 * ```tsx
 * <PuckPage data={page} />
 * ```
 */
export function PuckPage({
  data,
  config = asheeNativePuckConfig,
}: PuckPageProps): ReactNode {
  const children = renderBlocks(data.content ?? [], config, "root");

  return config.root.render({ children });
}
