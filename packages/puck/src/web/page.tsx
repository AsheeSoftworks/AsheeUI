"use client";

/**
 * Rendering a stored page, on the web.
 *
 * A published page renders through the editor's own renderer, which needs no editor:
 * the same block registry the builder reads is what a live site renders, so the two
 * cannot drift. The native entry offers a component of the same name, so an application
 * writes one import and one call and gets each platform's own renderer.
 */

import { type Data, Render } from "@puckeditor/core";
import type { AsheePuckData } from "../shared";
import { type AsheePuckConfig, asheePuckConfig } from "./config";

/**
 * Props of {@link PuckPage}.
 */
export interface PuckPageProps {
  /** The page the builder published. */
  data: AsheePuckData;

  /** The block registry to render with. Defaults to the AsheeUI configuration. */
  config?: AsheePuckConfig;
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
export function PuckPage({ data, config = asheePuckConfig }: PuckPageProps) {
  return <Render config={config} data={data as unknown as Data} />;
}
