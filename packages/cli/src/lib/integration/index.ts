/**
 * Integration dispatcher for AsheeUI CLI.
 * This module provides the buildIntegration function that dispatches to
 * the appropriate framework-specific integration builder based on the
 * detected framework.
 */

import type { IntegrationContext, IntegrationResult } from "../common/types";
import { buildNextIntegration } from "./next";
import { buildTanStackStartIntegration } from "./tanstack-start";
import { buildViteIntegration } from "./vite";

/**
 * Dispatch to the per-framework integration builder for `ctx.framework`.
 *
 * @param ctx - {@link IntegrationContext} describing the project.
 * @returns The {@link IntegrationResult} produced by the framework builder.
 */
export async function buildIntegration(
  ctx: IntegrationContext,
): Promise<IntegrationResult> {
  switch (ctx.framework) {
    case "next":
      return buildNextIntegration(ctx);
    case "vite-react":
      return buildViteIntegration(ctx);
    case "tanstack-start":
      return buildTanStackStartIntegration(ctx);
  }
}

export type {
  FileEdit,
  FileWrite,
  IntegrityCheck,
} from "../common/types";
export {
  resolveGlobalCss,
  resolveRouterOrEntryPoint,
  resolveViteOrAppConfig,
} from "./resolvers";
