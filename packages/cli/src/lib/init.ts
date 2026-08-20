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

  // 1. Framework Resolution & Structure
  const framework = await resolveFramework(cwd);
  const detection = await detectFramework({ cwd });
  const structure = await detectProjectStructure({ cwd, framework });

  if (!opts.yes) {
    p.log.info(
      `Framework detected: ${frameworkLabel(framework)} (confidence: ${detection.confidence})`,
    );
  }

  // 2. Build Integration & Inspect Dependencies
  const integration = await buildIntegration({
    directory: cwd,
    framework,
    structure,
  });

  const deps = await inspectDependencies(
    cwd,
    integration.dependenciesToInstall,
    opts.yes,
  );

  buildPlan(integration.summary, deps.missingDependencies, structure);

  // 3. Execution Preview & Confirmation
  if (!opts.yes) {
    const planLines = [
      ...integration.summary.map((item) => `• ${item}`),
      ...(deps.missingDependencies.length > 0
        ? [`• Install missing packages: ${deps.missingDependencies.join(", ")}`]
        : ["• All required dependencies are installed"]),
    ].join("\n");

    p.note(planLines, "Execution Plan");

    const confirmed = await p.confirm({
      message: "Apply these changes?",
      initialValue: true,
    });

    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
  }

  const failures: string[] = [];

  // 4. File Writes (visual step reporting)
  p.log.step("Creating config and provider files");
  const createdFiles: string[] = [];
  for (const write of integration.fileWrites) {
    const result = await applyWrite(write);
    reportResult(result, failures, createdFiles, cwd);
  }

  // 5. File Edits (visual step reporting)
  p.log.step("Applying integrations to project files");
  const modifiedFiles: string[] = [];
  for (const edit of integration.fileEdits) {
    const result = await applyEdit(edit);
    reportResult(result, failures, modifiedFiles, cwd);
  }

  // 6. Integrity Verification
  p.log.step("Checking file integrity");
  const integrityFailures: string[] = [];
  for (const check of integration.integrityChecks) {
    const ok = await verifyEdits(check);
    if (!ok) {
      integrityFailures.push(
        `• ${check.projectRelativeFile}: ${check.message}`,
      );
    } else if (!opts.yes) {
      p.log.success(`✓ Verified ${check.projectRelativeFile}`);
    }
  }

  // 7. Report failures explicitly instead of letting them escape to clack
  if (failures.length > 0) {
    p.log.warn(
      `${failures.length} step(s) could not be applied automatically:`,
    );
    p.note(failures.join("\n"), "Manual action required");
  }

  if (integrityFailures.length > 0) {
    p.log.warn("Some integrity checks did not pass:");
    p.note(integrityFailures.join("\n"), "Integrity warnings");
  }

  // 8. Dependency Installation
  if (deps.missingDependencies.length > 0) {
    const installCmd = buildInstallCommand(
      deps.packageManager,
      deps.missingDependencies,
      opts.local,
    );

    p.log.step(`Installing missing dependencies with ${deps.packageManager}`);
    try {
      execSync(installCmd, { cwd, stdio: "inherit" });
      p.log.success("Dependencies installed successfully.");
    } catch {
      p.log.warn("Failed to install dependencies automatically.");
      p.note(
        `Failed to execute: ${installCmd}\nPlease run it manually after setup.`,
        "Installation Error",
      );
    }
  }

  if (!opts.yes) {
    p.log.success(
      `Ashee UI successfully configured for ${frameworkLabel(framework)}!`,
    );
    p.outro("Done! Check your project files and happy hacking.");
  }

  return {
    framework,
    filesCreated: createdFiles,
    filesModified: modifiedFiles,
    dependenciesInstalled: deps.missingDependencies,
  };
}

/**
 * Report a single write/edit result in the CLI output and collect failures.
 * Successful file paths are recorded for the final `InitResult`.
 */
function reportResult(
  result: {
    success: boolean;
    path: string;
    actionDescription: string;
    error?: string;
  },
  failures: string[],
  successfulFiles: string[],
  cwd: string,
): void {
  const relativePath = result.path.replace(`${cwd}/`, "");

  if (result.success) {
    successfulFiles.push(relativePath);
    console.log(`  ✓ ${result.actionDescription}`);
  } else {
    const reason = result.error ?? "Unknown error";
    failures.push(`• ${relativePath}: ${reason}`);
    console.log(`  ▲ ${result.actionDescription} — ${relativePath}`);
    console.log(`    ${reason}`);
  }
}

function buildInstallCommand(
  packageManager: "pnpm" | "yarn" | "npm" | "bun",
  packages: string[],
  isLocal = false,
): string {
  if (isLocal) {
    switch (packageManager) {
      case "pnpm":
        return `pnpm add ${packages.map((p) => `${p}@workspace:*`).join(" ")}`;
      case "yarn":
        return `yarn add ${packages.map((p) => `${p}@portal:`).join(" ")}`;
      case "npm":
      case "bun":
        // Resolves packages to relative monorepo folders
        return `npm install ${packages.map((p) => `file:../../packages/${p.replace("@asheeui/", "")}`).join(" ")}`;
    }
  }

  // Non-local fallback
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
