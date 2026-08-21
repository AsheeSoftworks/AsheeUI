import * as p from "@clack/prompts";
import { detectFramework } from "../common/detect";
import type { SupportedFramework } from "../common/types";

const FRAMEWORK_OPTIONS: { value: SupportedFramework; label: string }[] = [
  { value: "next", label: "Next.js" },
  { value: "vite-react", label: "Vite + React" },
  { value: "tanstack-start", label: "TanStack Start" },
];

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
