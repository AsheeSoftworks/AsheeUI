import { execSync } from "node:child_process";
import * as p from "@clack/prompts";
import { inspectDependencies } from "../common/deps";
import { detectFramework, frameworkLabel } from "../common/detect";
import { applyEdit, applyWrite, verifyEdits } from "../common/file-utils";
import { detectProjectStructure } from "../common/structure";
import type { InitOptions, InitResult } from "../common/types";
import { buildIntegration } from "../integration/index";
import { buildInstallCommand } from "./install-command";
import { buildPlan } from "./plan";
import { reportResult } from "./report";
import { resolveFramework } from "./resolve-framework";

export async function runInit(
  opts: InitOptions,
  cwd = process.cwd(),
): Promise<InitResult> {
  if (!opts.yes) {
    p.intro("Ashee UI — init");
  }

  // Framework Resolution & Structure
  const framework = await resolveFramework(cwd);
  const detection = await detectFramework({ cwd });
  const structure = await detectProjectStructure({ cwd, framework });

  if (!opts.yes) {
    p.log.info(
      `Framework detected: ${frameworkLabel(framework)} (confidence: ${detection.confidence})`,
    );
  }

  // Build Integration & Inspect Dependencies
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

  // Execution Preview & Confirmation
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

  // File Writes (visual step reporting)
  p.log.step("Creating config and provider files");
  const createdFiles: string[] = [];
  for (const write of integration.fileWrites) {
    const result = await applyWrite(write);
    reportResult(result, failures, createdFiles, cwd);
  }

  // File Edits (visual step reporting)
  p.log.step("Applying integrations to project files");
  const modifiedFiles: string[] = [];
  for (const edit of integration.fileEdits) {
    const result = await applyEdit(edit);
    reportResult(result, failures, modifiedFiles, cwd);
  }

  // Integrity Verification
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

  // Report failures explicitly instead of letting them escape to clack
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

  // Dependency Installation
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
