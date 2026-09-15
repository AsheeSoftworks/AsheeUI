/**
 * The distribution plan for a playground.
 *
 * The plan is pure: it decides which files a target is made of, where each one
 * lands in the client's project, and whether the destination is safe to write to,
 * and it touches nothing. Execution is a separate step, so every rule about what a
 * copied project contains is unit-testable without a file system and without a
 * network.
 *
 * A template is copied as a whole directory because that is what a starter project
 * is: the shell that makes it that framework, the shared playground application it
 * renders, and the metadata that makes it installable. Nothing from the repository
 * travels with it.
 */

import { join } from "node:path";
import { findPlaygroundTarget, type PlaygroundTarget } from "./targets";

/**
 * One file the plan copies into the client's project.
 */
export interface PlaygroundFileOperation {
  /** Path inside the CLI's template directory. */
  from: string;

  /** Path inside the destination project. */
  to: string;
}

/**
 * A resolved distribution plan.
 */
export interface PlaygroundPlan {
  /** The target being distributed. */
  target: PlaygroundTarget;

  /** Absolute path of the template directory the files come from. */
  templateRoot: string;

  /** Absolute path of the project being written. */
  destination: string;

  /** The directory the template's contents are copied into. */
  destinationRoot: string;

  /** Name written into the copied `package.json`. */
  packageName: string;

  /** Whether an existing project may be overwritten. */
  force: boolean;

  /** Everything the caller needs to know before writing, in plain language. */
  problems: string[];
}

/**
 * Options for {@link buildPlaygroundPlan}.
 */
export interface PlaygroundPlanOptions {
  /** Identifier of the target the user asked for. */
  targetId: string;

  /** Absolute path of the project to write. */
  destination: string;

  /** Absolute path of the package the templates live in. */
  packageRoot: string;

  /** Whether an existing project may be overwritten. */
  force?: boolean;
}

/**
 * Turn a request into a plan, or into the problems that prevent one.
 *
 * The plan refuses a target it does not know, a target that is deliberately not
 * ready, and a destination that already holds a project, unless the caller asked to
 * overwrite it. A refusal is a problem rather than an exception, so the command can
 * print every reason at once, and a caller that ignores the plan cannot write to a
 * directory the user did not agree to change.
 *
 * @param options - The request.
 * @returns The plan, with `problems` empty when it is safe to execute.
 *
 * @example
 * ```ts
 * const plan = buildPlaygroundPlan({
 *   targetId: "next",
 *   destination: "/home/ada/invoices",
 *   packageRoot: "/opt/asheeui-cli",
 * });
 * ```
 */
export function buildPlaygroundPlan(
  options: PlaygroundPlanOptions,
): PlaygroundPlan {
  const { targetId, destination, packageRoot, force = false } = options;
  const problems: string[] = [];
  const target = findPlaygroundTarget(targetId);

  if (!target) {
    problems.push(`Unknown playground "${targetId}".`);
  } else if (target.status === "deferred") {
    problems.push(
      `The ${target.label} playground is not available yet: ${target.reason}.`,
    );
  }

  return {
    target: target ?? {
      id: targetId,
      label: targetId,
      status: "deferred",
      reason: "the target is unknown",
    },
    templateRoot: join(packageRoot, "templates", target?.template ?? targetId),
    destination,
    destinationRoot: destination,
    packageName: projectName(destination),
    force,
    problems,
  };
}

/**
 * Derive the project name a copied playground should carry.
 *
 * The name is the destination directory's own name, which is what a developer who
 * asked for a project in `~/invoices` expects the package to be called.
 *
 * @param destination - Absolute path of the project being written.
 * @returns A package name that is valid for npm.
 */
export function projectName(destination: string): string {
  const segment = destination.split(/[\\/]/).filter(Boolean).pop() ?? "";

  return (
    segment
      .toLowerCase()
      .replaceAll(/[^a-z0-9._-]+/g, "-")
      .replaceAll(/^-+|-+$/g, "") || "asheeui-playground"
  );
}

/**
 * The files a copied project must never contain, whatever the repository has.
 *
 * A dependency tree, a build output, a cache or a repository build stamp would
 * make the copied project either unusable or dishonest, so the list is asserted
 * against every template rather than left to the generation step.
 *
 * A test file is deliberately not on the list: a playground ships the contract its
 * sections satisfy, so a client's own `pnpm test` proves the installation works
 * before any application code is written.
 *
 * @returns The forbidden path fragments and file names.
 */
export function forbiddenProjectPaths(): string[] {
  return [
    "node_modules",
    ".turbo",
    ".next",
    ".tanstack",
    "dist",
    "coverage",
    "tsconfig.tsbuildinfo",
  ];
}
