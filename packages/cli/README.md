# @asheeui/cli

Scaffold and maintain [AsheeUI](https://asheeui.com) in an existing React app.

The CLI detects your framework (Next.js, Vite, or TanStack Start), writes an `asheeui.config.*` file, wraps your app in `AsheeUIProvider`, and can audit or repair an existing setup.

- **Documentation:** https://asheeui.com
- **Repository:** https://github.com/AsheeSoftworks/AsheeUI
- **Issues:** https://github.com/AsheeSoftworks/AsheeUI/issues

---

## Installation

Run it on demand with `npx`, or add it as a dev dependency:

```bash
# On demand
npx asheeui init
```

```bash
# As a dev dependency
pnpm add -D @asheeui/cli
pnpm asheeui init
```

Also works with `npm install -D @asheeui/cli`, `yarn add -D @asheeui/cli`, or `bun add -d @asheeui/cli`.

---

## Commands

| Command | Aliases | Description |
| --- | --- | --- |
| `init` | `i` | Initialize AsheeUI in your project (idempotent) |
| `list` | `ls`, `l` | List all available AsheeUI components |
| `doctor` | `doc`, `dr` | Check your project for AsheeUI setup issues |
| `fix` | `f` | Automatically repair issues found by `doctor` |

### `init`

Scaffolds AsheeUI in your project: creates the config file, installs dependencies, adds the style imports to your global CSS, and wraps your root layout.

This command is **idempotent** — running it multiple times safely checks for existing configuration before writing and will never duplicate code or imports.

```bash
npx asheeui init
# Alias
npx asheeui i
```

**Options**

| Option | Type | Description |
| --- | --- | --- |
| `-t, --template <name>` | string | Template to use (default: `"default"`) |
| `--yes` | flag | Skip interactive prompts and use defaults |
| `-h, --help` | flag | Show help for command |

**What it does**

1. Detects your framework (Next.js, TanStack Start, or Vite + React)
2. Checks for existing setup elements to prevent duplicate imports
3. Creates `asheeui.config.ts` in your project root (skipped if one already exists)
4. Safely appends `@import "asheeui/styles"` to your global CSS file if missing
5. Wraps your root component with `AsheeUIProvider` and imports the `config`
6. Installs missing peer dependencies using your detected package manager (`npm`, `pnpm`, `yarn`, or `bun`)

```bash
# Interactive mode (default)
npx asheeui init

# Skip all prompts
npx asheeui init --yes
```

> **Removed flag:** The legacy `--local` flag (local monorepo workspace dependencies) was removed. Dependencies now resolve normally through your package manager.

### `list`

Lists all available UI components directly from the `asheeui` library package (an installed copy, a local registry path, or the package source in this monorepo).

```bash
npx asheeui list
# Aliases
npx asheeui ls
npx asheeui l
```

**Options**

| Option | Type | Description |
| --- | --- | --- |
| `-d, --dir <path>` | string | Project directory used to locate the `asheeui` package (default: current directory) |
| `--path <path>` | string | Path to an `asheeui` package root or local registry folder |
| `--json` | flag | Output the component list as JSON |
| `-h, --help` | flag | Show help for command |

### `doctor`

Checks your project for common AsheeUI configuration issues and provides diagnostic output.

```bash
npx asheeui doctor
# Aliases
npx asheeui doc
npx asheeui dr
```

**Options**

| Option | Type | Description |
| --- | --- | --- |
| `-d, --dir <path>` | string | Project directory to scan (default: current directory) |
| `-h, --help` | flag | Show help for command |

**What it checks**

- Config file existence (`asheeui.config.ts` or `.js` in the project root or `src/`)
- Global CSS style import (`@import "asheeui/styles"`)
- Required peer dependencies (`react`, `react-dom`, `tailwindcss`, `clsx`, `tailwind-merge`)
- `AsheeUIProvider` wrapping in the root entrypoint
- Optional theme augmentation (`AsheeThemeNameRegistry`) — informational

### `fix`

Automatically resolves and repairs setup issues detected by the `doctor` command.

```bash
npx asheeui fix
# Alias
npx asheeui f
```

**Options**

| Option | Type | Description |
| --- | --- | --- |
| `-d, --dir <path>` | string | Project directory to fix (default: current directory) |
| `--skip-install` | flag | Do not run package-manager installs (only apply file changes) |
| `-h, --help` | flag | Show help for command |

**What it fixes**

- Appends missing `@import "asheeui/styles"` to your global CSS (or creates `src/index.css`)
- Generates a default `asheeui.config.ts` if missing
- Wraps your root with `AsheeUIProvider`
- Installs missing peer dependencies automatically with your detected package manager (`--skip-install` disables this)

---

## Generated config

The CLI creates `asheeui.config.ts` in your project root:

```ts
import { type ExternalConfig } from "asheeui";

const config: ExternalConfig = {
  defaultTheme: "light",
  defaultVariant: "solid",
  defaultColor: "primary",
  components: {},
};

export default defineConfig(config);
```

See the [Configuration docs](https://asheeui.com/docs/configuration) for all available options.

---

## Troubleshooting

### Running `init` multiple times

The CLI safely checks file contents and strings before applying changes. Running `npx asheeui init` multiple times will not duplicate CSS directives, plugin registrations, or configuration wrappers.

### CLI fails to detect framework

Ensure you are running `asheeui` commands from your project root directory where `package.json` is located.

### Configuration or style issues

If component styles are missing or provider errors occur:

1. Run `npx asheeui doctor` to diagnose the issue.
2. Run `npx asheeui fix` to automatically repair missing files or imports.

---

## License

MIT. See [LICENSE](./LICENSE).

---

### Key changes from your draft

- **Added an Installation section** — your draft jumped straight from the intro to "Usage" with a single `npx` example. npm readers scan for install instructions first, so making the two install paths (on-demand vs. dev dependency) explicit helps.
- **Pulled the full command reference into the README** — your CLI docs file had all the options, aliases, and "what it does/fixes" details. Since `@asheeui/cli` is its own npm package, that content belongs here too, not just on the docs site.
- **Converted the CLI Reference's `<PackageManagerTabs>` component** into plain `bash` code blocks — React components don't render on npm, so the install instructions now show up as text.
- **Added the "Generated config" section** — readers want to see what the CLI actually writes before running it.
- **Brought over the Troubleshooting section** — this is the kind of thing npm readers search for when something breaks, and it was missing from your draft.
- **Made the docs links absolute** (`https://asheeui.com/docs/...`) — relative links like `/docs/configuration` break on npm's markdown renderer, which doesn't know your site's base URL.
- **Minor copy fixes** — "and import the `config`" → "and imports the `config`" in the init steps; kept your existing intro and links intact since they were already clear.