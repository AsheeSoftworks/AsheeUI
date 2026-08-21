import type { IntegrationContext, IntegrationResult } from "../common/types";
import { buildNextIntegration } from "./next";
import { buildTanStackStartIntegration } from "./tanstack-start";
import { buildViteIntegration } from "./vite";

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
