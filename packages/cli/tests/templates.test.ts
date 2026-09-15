import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { defaultConfigContent } from "../src/lib/init/templates";

const run = promisify(execFile);

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "ashee-templates-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("defaultConfigContent", () => {
  it("renders a TypeScript config the generated wiring can import", () => {
    const source = defaultConfigContent("typescript");

    // The generated provider wiring does `import config from "./asheeui.config"`,
    // so a default export is what makes the scaffolded project compile.
    expect(source).toContain("export default config;");
    expect(source).toContain(
      'import type { ExternalConfig } from "asheeui";',
    );
    expect(source).not.toContain("export const config");
    expect(source).not.toContain("export default const");
  });

  it("renders JavaScript that is valid as an ES module", async () => {
    const source = defaultConfigContent("javascript");

    expect(source).toContain("export default config;");
    expect(source).not.toContain("export default const");

    // `node --check` parses the file without running it, so a syntax error such
    // as `export default const config = {` fails this test.
    await writeFile(join(dir, "package.json"), '{"type":"module"}', "utf8");
    const file = join(dir, "asheeui.config.js");
    await writeFile(file, source, "utf8");

    await expect(run(process.execPath, ["--check", file])).resolves.toBeDefined();
  });

  it("documents the config type for JavaScript projects", () => {
    // The doc comment promises a JSDoc typedef, which is what gives editors
    // theming options in a JavaScript project.
    expect(defaultConfigContent("javascript")).toContain(
      '@type {import("asheeui").ExternalConfig}',
    );
  });
});
