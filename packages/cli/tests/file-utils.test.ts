import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { applyEdit, applyWrite } from "../src/lib/common/file-utils";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "ashee-file-utils-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("applyEdit", () => {
  it("returns a success EditResult and applies the edit", async () => {
    const target = join(dir, "src", "main.tsx");
    await mkdir(join(dir, "src"), { recursive: true });
    await writeFile(
      target,
      'import { StrictMode } from "react";\nconst x = 1;',
    );

    const result = await applyEdit({
      path: target,
      search: 'import { StrictMode } from "react";',
      replace:
        'import { StrictMode } from "react";\nimport { AsheeUIProvider } from "asheeui";',
      description: "Inject provider import",
    });

    expect(result.success).toBe(true);
    expect(result.path).toBe(target);
    expect(result.actionDescription).toBe("Inject provider import");
    expect(result.error).toBeUndefined();

    const updated = await readFile(target, "utf8");
    expect(updated).toContain('import { AsheeUIProvider } from "asheeui";');
  });

  it("returns a failed EditResult (no throw) when the file is missing", async () => {
    const missing = join(dir, "does-not-exist.tsx");

    const result = await applyEdit({
      path: missing,
      search: "anything",
      replace: "nothing",
    });

    expect(result.success).toBe(false);
    expect(result.path).toBe(missing);
    expect(result.error).toContain("does not exist");
  });

  it("returns a failed EditResult with notFoundMessage when search is missing", async () => {
    const target = join(dir, "vite.config.ts");
    await writeFile(target, "export default {};");

    const result = await applyEdit({
      path: target,
      search: "plugins: [",
      replace: "plugins: [asheeui(), ",
      notFoundMessage: "Could not find plugins array in vite.config.ts",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Could not find plugins array in vite.config.ts");
  });

  it("falls back to a descriptive error without notFoundMessage", async () => {
    const target = join(dir, "file.txt");
    await writeFile(target, "hello world");

    const result = await applyEdit({
      path: target,
      search: "missing pattern",
      replace: "replacement",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('"missing pattern"');
    expect(result.error).toContain(target);
  });

  it("replaces all occurrences when all: true", async () => {
    const target = join(dir, "file.txt");
    await writeFile(target, "a b a b a");

    const result = await applyEdit({
      path: target,
      search: "a",
      replace: "x",
      all: true,
    });

    expect(result.success).toBe(true);
    const updated = await readFile(target, "utf8");
    expect(updated).toBe("x b x b x");
  });
});

describe("applyWrite", () => {
  it("creates parent directories and returns a success EditResult", async () => {
    const target = join(dir, "nested", "config.ts");

    const result = await applyWrite({
      path: target,
      content: "export default {};",
      description: "Create config",
    });

    expect(result.success).toBe(true);
    expect(result.path).toBe(target);
    expect(result.actionDescription).toBe("Create config");
    expect(await readFile(target, "utf8")).toBe("export default {};");
  });

  it("returns a failed EditResult when a file blocks the parent directory", async () => {
    // Create a regular file, then try to write *through* it as a directory.
    const blocker = join(dir, "blocker");
    await writeFile(blocker, "i am a file");
    const invalidPath = join(blocker, "file.ts");

    const result = await applyWrite({
      path: invalidPath,
      content: "x",
    });

    expect(result.success).toBe(false);
    expect(result.path).toBe(invalidPath);
    expect(result.error).toContain("Failed writing file");
  });
});
