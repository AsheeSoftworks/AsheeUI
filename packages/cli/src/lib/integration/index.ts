import type { IntegrationContext, IntegrationResult } from "../types";
import { buildNextIntegration } from "./next";
import { buildTanStackStartIntegration } from "./tanstack-start";
import { buildViteIntegration } from "./vite";

export function buildIntegration(ctx: IntegrationContext): IntegrationResult {
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
} from "../types";
