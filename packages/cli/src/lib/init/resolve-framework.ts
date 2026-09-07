/**
 * Framework resolver for AsheeUI CLI init command.
 * This module provides the resolveFramework function that attempts to
 * auto-detect the framework or prompts the user to select one.
 */

import * as p from "@clack/prompts";
import { detectFramework } from "../common/detect";
import type { SupportedFramework } from "../common/types";

const FRAMEWORK_OPTIONS: { value: SupportedFramework; label: string }[] = [
  { value: "next", label: "Next.js" },
  { value: "vite-react", label: "Vite + React" },
  { value: "tanstack-start", label: "TanStack Start" },
];

/**
 * Resolve which {@link SupportedFramework} the project at `cwd` is using.
 *
 * Tries auto-detection first. If detection fails (`framework === "unknown"`),
 * prompts the user to pick from the supported options using
 * `@clack/prompts`. A user cancellation exits the process with code 0.
 *
 * @param cwd - Project directory used for auto-detection.
 * @returns The resolved {@link SupportedFramework}.
 */
export async function resolveFramework(
  cwd: string,
): Promise<SupportedFramework> {
  const detection = await detectFramework({ cwd });

  if (detection.framework !== "unknown") {
    return detection.framework;
  }

  const answer = await p.select({
    message:
      "We couldn't determine your framework. Which framework are you using?",
    options: FRAMEWORK_OPTIONS,
  });

  if (p.isCancel(answer)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  return answer as SupportedFramework;
}
