import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { detectPackageManager } from "../src/lib/common/file-utils";
import {
  buildInstallCommand,
  formatInstallCommand,
} from "../src/lib/common/pm";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "ashee-pm-"));
  // Ignore whatever package manager invoked the test runner.
  vi.stubEnv("npm_config_user_agent", "");
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
  vi.unstubAllEnvs();
});

describe("detectPackageManager", () => {
  it("detects pnpm from pnpm-lock.yaml", async () => {
    await writeFile(join(dir, "pnpm-lock.yaml"), "");
    await expect(detectPackageManager(dir)).resolves.toBe("pnpm");
  });

  it("detects yarn from yarn.lock", async () => {
    await writeFile(join(dir, "yarn.lock"), "");
    await expect(detectPackageManager(dir)).resolves.toBe("yarn");
  });

  it("detects bun from bun.lock", async () => {
    await writeFile(join(dir, "bun.lock"), "");
    await expect(detectPackageManager(dir)).resolves.toBe("bun");
  });

  it("detects bun from bun.lockb", async () => {
    await writeFile(join(dir, "bun.lockb"), "");
    await expect(detectPackageManager(dir)).resolves.toBe("bun");
  });

  it("detects npm from package-lock.json", async () => {
    await writeFile(join(dir, "package-lock.json"), "{}");
    await expect(detectPackageManager(dir)).resolves.toBe("npm");
  });

  it("falls back to npm when no lockfile exists", async () => {
    await expect(detectPackageManager(dir)).resolves.toBe("npm");
  });

  it("prefers the running package manager over lockfiles", async () => {
    await writeFile(join(dir, "yarn.lock"), "");
    vi.stubEnv("npm_config_user_agent", "pnpm/9.0.0 npm/? node/v20.0.0");
    await expect(detectPackageManager(dir)).resolves.toBe("pnpm");
  });
});

describe("formatInstallCommand", () => {
  it("formats pnpm add", () => {
    expect(formatInstallCommand("pnpm", ["react", "react-dom"])).toBe(
      "pnpm add react react-dom",
    );
  });

  it("formats npm install", () => {
    expect(formatInstallCommand("npm", ["react"])).toBe("npm install react");
  });

  it("formats yarn add", () => {
    expect(formatInstallCommand("yarn", ["react"])).toBe("yarn add react");
  });

  it("formats bun add", () => {
    expect(formatInstallCommand("bun", ["react"])).toBe("bun add react");
  });

  it("adds -D for dev dependencies on every manager", () => {
    expect(formatInstallCommand("pnpm", ["tailwindcss"], true)).toBe(
      "pnpm add -D tailwindcss",
    );
    expect(formatInstallCommand("npm", ["tailwindcss"], true)).toBe(
      "npm install -D tailwindcss",
    );
    expect(formatInstallCommand("yarn", ["tailwindcss"], true)).toBe(
      "yarn add -D tailwindcss",
    );
    expect(formatInstallCommand("bun", ["tailwindcss"], true)).toBe(
      "bun add -d tailwindcss",
    );
  });

  it("returns an empty string for no packages", () => {
    expect(formatInstallCommand("npm", [])).toBe("");
  });
});

describe("buildInstallCommand (init helper)", () => {
  it("matches formatInstallCommand across managers", () => {
    expect(buildInstallCommand("pnpm", ["asheeui", "@asheeui/vite"])).toBe(
      formatInstallCommand("pnpm", ["asheeui", "@asheeui/vite"]),
    );
    expect(buildInstallCommand("npm", ["asheeui"])).toBe("npm install asheeui");
    expect(buildInstallCommand("yarn", ["asheeui"])).toBe("yarn add asheeui");
    expect(buildInstallCommand("bun", ["asheeui"])).toBe("bun add asheeui");
  });
});
