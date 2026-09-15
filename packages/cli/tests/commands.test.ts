import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { registerDoctorCommand } from "../src/commands/doctor";

let dir: string;
let previousExitCode: typeof process.exitCode;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "ashee-commands-"));
  previousExitCode = process.exitCode;
  // The command prints a report; these tests only care about the exit code.
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(async () => {
  vi.restoreAllMocks();
  process.exitCode = previousExitCode;
  await rm(dir, { recursive: true, force: true });
});

async function write(name: string, content: string) {
  const file = join(dir, name);
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, content, "utf8");
}

async function runDoctorCommand() {
  const program = new Command();
  registerDoctorCommand(program);
  await program.parseAsync(["node", "asheeui", "doctor", "--dir", dir]);
}

describe("command exit codes", () => {
  it("exits non-zero when doctor finds a broken project", async () => {
    // No stylesheet import and no provider wiring, so checks fail rather than
    // merely warn.
    await write("src/main.tsx", "export const app = 1;");

    process.exitCode = 0;
    await runDoctorCommand();

    expect(process.exitCode).toBe(1);
  });

  it("exits zero when doctor finds nothing broken", async () => {
    await write(
      "package.json",
      JSON.stringify({
        name: "healthy-fixture",
        private: true,
        dependencies: {
          asheeui: "^0.8.0",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
        },
        devDependencies: { tailwindcss: "^4.0.0" },
      }),
    );
    await write("src/index.css", '@import "asheeui/styles";');
    await write("src/main.tsx", 'import { AsheeUIProvider } from "asheeui";');

    process.exitCode = 0;
    await runDoctorCommand();

    expect(process.exitCode).toBe(0);
  });
});
