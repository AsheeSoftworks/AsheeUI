/**
 * Tests for the command registry.
 *
 * The registry is what a consumer sees first: `asheeui --help` lists it, and a
 * command missing from it cannot be run. The playground command was removed
 * along with the applications it copied, so these tests state both halves of
 * that contract — every supported command is present, and the removed one is
 * absent from the registry and from the help output.
 */

import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createProgram } from "../src/program";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "ashee-program-"));
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(dir, { recursive: true, force: true });
});

/** Write a fixture file, creating its parent directories. */
async function write(name: string, content = "") {
  const file = join(dir, name);
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, content, "utf8");
}

/**
 * Scaffold the smallest `@asheeui/web` package the list command can read.
 *
 * @returns Absolute path of the package root.
 */
async function scaffoldWebPackage(): Promise<string> {
  await write(
    join("asheeui-pkg", "package.json"),
    JSON.stringify({ name: "@asheeui/web", main: "./src/index.ts" }),
  );
  await write(
    join("asheeui-pkg", "src", "index.ts"),
    'export * from "./components/button";\n',
  );
  await write(
    join("asheeui-pkg", "src", "components", "button", "index.tsx"),
    "export {};",
  );

  return join(dir, "asheeui-pkg");
}

describe("command registry", () => {
  it("registers every supported command and its aliases", () => {
    const program = createProgram();
    const names = program.commands.map((command) => command.name());

    expect(names).toEqual(["init", "doctor", "list", "fix"]);
    expect(program.commands.flatMap((command) => command.aliases())).toEqual([
      "i",
      "doc",
      "dr",
      "ls",
      "l",
      "f",
    ]);
  });

  it("does not register the removed playground command", () => {
    const program = createProgram();
    const names = program.commands.flatMap((command) => [
      command.name(),
      ...command.aliases(),
    ]);

    expect(names).not.toContain("playground");
    expect(names).not.toContain("pg");
  });

  it("does not mention a command it no longer has in its help", () => {
    const help = createProgram().helpInformation();

    for (const name of ["init", "doctor", "list", "fix"]) {
      expect(help).toContain(name);
    }
    expect(help).not.toMatch(/playground/i);
  });

  it("still runs list against an explicit package path", async () => {
    const packageRoot = await scaffoldWebPackage();
    const output: string[] = [];
    vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      output.push(args.map(String).join(" "));
    });

    const program = createProgram();
    await program.parseAsync([
      "node",
      "asheeui",
      "list",
      "--path",
      packageRoot,
      "--json",
    ]);

    expect(JSON.parse(output.join("\n"))).toEqual([
      { name: "button", group: "button" },
    ]);
  });
});
