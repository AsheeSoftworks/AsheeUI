# CLI

`@asheeui/cli` scaffolds and checks an AsheeUI setup. **It is optional.** The
[installation steps](./installation.md) are the whole setup, the framework works
with no configuration file, and every command below has a manual equivalent.

## Commands

| Command | Aliases | Purpose |
| --- | --- | --- |
| `asheeui init` | `i` | Write an `asheeui.config.*` file, add the stylesheet import, and wrap the application root |
| `asheeui doctor` | `doc`, `dr` | Check the stylesheet import, the provider, the peer dependencies and the configuration |
| `asheeui fix` | `f` | Apply the repairs `doctor` can make automatically, then report what is left |
| `asheeui list` | `ls`, `l` | List the components this version of the package exports |
| `asheeui playground` | `pg` | Create one of the official playground projects in a directory you choose |

`init` is safe to re-run: it detects existing files, edits and dependencies and
leaves them alone, so running it twice changes nothing the second time.

## Flags

| Flag | Commands | Meaning |
| --- | --- | --- |
| `-d, --dir <path>` | `doctor`, `fix`, `list` | Project directory to operate on |
| `--path <path>` | `list` | Explicit path to a package root |
| `--json` | `list` | Emit the component list as JSON |
| `-t, --template <name>` | `init` | Template to apply |
| `--yes` | `init` | Skip the prompts and accept the defaults |
| `--skip-install` | `fix` | Do not run a package-manager install; report the commands instead |
| `--list` | `playground` | Print the playgrounds this version ships |
| `--force` | `playground` | Replace the files the playground owns in a directory that already has files |

## `asheeui playground`

```bash
npx asheeui playground --list
npx asheeui playground next ./invoices
```

| Argument | Meaning |
| --- | --- |
| `[target]` | `next`, `vite` or `tanstack`. `expo` is listed and answered for, and refused with the reason it is not available yet |
| `[directory]` | Where to create the project. Defaults to the current directory |

The copied project depends on the published `asheeui` package and contains the
shared playground application, so it installs and runs on its own. It writes
nothing into a directory that already holds any of the project's files unless you
pass `--force`, which is what keeps a copy from replacing work you have already
done. See [Playgrounds](./playgrounds.md) for what a copied project contains.


## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Nothing is broken |
| `1` | `doctor` found a failing check, `fix` left something failing, or a command could not run |

That makes either command usable as a check in a script or a CI job:

```bash
npx asheeui doctor || echo "the setup needs attention"
```

## What `doctor` checks

| Check | Fails when | Manual equivalent |
| --- | --- | --- |
| Stylesheet import | A global stylesheet does not import `asheeui/styles` | Add the import yourself |
| Root provider | No entry point wraps the application in `AsheeUIProvider` | Wrap the root yourself |
| Peer dependencies | `react`, `react-dom` or `tailwindcss` is missing | Install them |
| Configuration file | Never. The file is optional, so its absence is informational | Create one only if you want one |

## The configuration file

`init` writes an `asheeui.config.ts` (or `.js`) that exports a configuration
object as the module's default export, and imports it into the provider it wires
up. The file is a plain module: nothing reads it from disk, so it works with any
bundler and can be replaced by an inline object on the provider.

---

Built with AI. See [Ashee Softworks](https://asheesoftworks.com).
