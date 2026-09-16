# The Expo playground

The native playground: it renders the same shared application the other three playgrounds
render, on a device, a simulator and the web, from one source.

## Run it

```sh
pnpm playground:expo        # from the workspace root
pnpm start                  # from this directory, the same command
pnpm web                    # straight to the browser
pnpm build                  # export the web bundle into dist/
```

The Expo CLI, the Metro bundler and everything else this app uses are **project-local
binaries**, so they are on `PATH` inside a pnpm script and nowhere else. That is why `expo
start` typed into this directory says `command not found` while `pnpm start` in the same
directory runs it: `pnpm` puts `node_modules/.bin` on the path for the script it runs. The
same holds for `next` and `vite` in the other playgrounds, and for every tool this
workspace installs.

## What it is

A stress test rather than a demonstration, like the other playgrounds: every component the
documentation claims, in every state it claims, in combinations a marketing screen would
avoid. The screens come from `@asheeui/e2e-gallery`, so a change there reaches all four
playgrounds at once.

What this entry point owns is only what React Native requires: the document shell, the
entry point that registers the application root, and the Metro, Babel and Tailwind wiring
that NativeWind needs. See [the playground documentation](../../docs/playgrounds.md) for
that boundary, and [the Expo installation page](https://www.asheeui.com/docs/installation/expo)
for setting up an application of your own.
