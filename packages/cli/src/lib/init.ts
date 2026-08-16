import { execSync } from "node:child_process";
import * as p from "@clack/prompts";
import { inspectDependencies } from "./deps.js";
import { detectFramework, frameworkLabel } from "./detect.js";
import { applyEdit, applyWrite, verifyEdits } from "./file-utils.js";
import { buildIntegration } from "./integration/index.js";
import { buildPlan } from "./plan.js";
import { detectProjectStructure } from "./structure.js";
import type { InitOptions, InitResult, SupportedFramework } from "./types.js";

const FRAMEWORK_OPTIONS: { value: SupportedFramework; label: string }[] = [
  { value: "next", label: "Next.js" },
  { value: "vite-react", label: "Vite + React" },
  { value: "tanstack-start", label: "TanStack Start" },
];

async function resolveFramework(cwd: string): Promise<SupportedFramework> {
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

export async function runInit(
  opts: InitOptions,
  cwd = process.cwd(),
): Promise<InitResult> {
  if (!opts.yes) {
    p.intro("Ashee UI — init");
  }

  const framework = await resolveFramework(cwd);
  const detection = await detectFramework({ cwd });

  const structure = await detectProjectStructure({ cwd, framework });
  const deps = await inspectDependencies(cwd);

  const integration = buildIntegration({
    directory: cwd,
    framework,
    structure,
  });

  const _plan = buildPlan(
    integration.summary,
    deps.missingDependencies,
    structure,
  );

  if (!opts.yes) {
    const confirmed = await p.confirm({
      message: "Apply these changes?",
      initialValue: true,
    });
    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
  }

  // Apply edits to existing files (preserves user code)
  for (const edit of integration.fileEdits) {
    await applyEdit(edit);
  }

  // Write new files (config, provider wrapper, etc.)
  for (const write of integration.fileWrites) {
    await applyWrite(write);
  }

  // Verify critical integrations landed
  for (const check of integration.integrityChecks) {
    await verifyEdits(check);
  }

  const filesCreated: string[] = [];
  const filesModified: string[] = [];

  for (const write of integration.fileWrites) {
    filesCreated.push(write.path);
  }

  for (const edit of integration.fileEdits) {
    filesModified.push(edit.path);
  }

  // Install missing Ashee packages
  if (deps.missingDependencies.length > 0) {
    const installCmd = buildInstallCommand(
      deps.packageManager,
      deps.missingDependencies,
    );
    try {
      execSync(installCmd, { cwd, stdio: "inherit" });
    } catch {
      p.note(
        `Failed to run: ${installCmd}\nRun it manually after init.`,
        "Install",
      );
    }
  }

  const filesCreatedRelative = filesCreated.map((f) =>
    f.replace(`${cwd}/`, ""),
  );
  const filesModifiedRelative = filesModified.map((f) =>
    f.replace(`${cwd}/`, ""),
  );

  if (!opts.yes) {
    p.log.success(
      `Ashee UI initialized for ${frameworkLabel(framework)}. ` +
        `Detection confidence: ${detection.confidence}`,
    );
    p.outro("Done. Check the summary above for next steps.");
  }

  return {
    framework,
    filesCreated: filesCreatedRelative,
    filesModified: filesModifiedRelative,
    dependenciesInstalled: deps.missingDependencies,
  };
}

function buildInstallCommand(
  packageManager: "pnpm" | "yarn" | "npm" | "bun",
  packages: string[],
): string {
  switch (packageManager) {
    case "pnpm":
      return `pnpm add ${packages.join(" ")}`;
    case "yarn":
      return `yarn add ${packages.join(" ")}`;
    case "npm":
      return `npm install ${packages.join(" ")}`;
    case "bun":
      return `bun add ${packages.join(" ")}`;
  }
}
