# AsheeUI Next.js playground

One of the three playground applications that consume AsheeUI the way a real
project does. It is an App Router application whose end-to-end test is the proof
that the library works on Next.js.

## What it proves

- Every AsheeUI component is a client component in an App Router application, and
  it is still server-rendered: the gallery is prerendered by Next.js and then
  hydrated in the browser without a mismatch.
- The consumer setup from the documentation works as written: the provider in the
  root layout, `@import "asheeui/styles"` after the Tailwind import, and a
  `asheeui.config.ts` at the project root.
- A server component and a client island compose in one tree, and the island's
  server-rendered markup satisfies the same gallery contract the other two
  playgrounds assert.
- Next.js's own `Link` and `Image` can be substituted into every component that
  renders a link or a picture, with the routing and image options passed through.

## Running it

```bash
pnpm --filter @asheeui/next-playground dev      # development server
pnpm --filter @asheeui/next-playground build    # production build
pnpm --filter @asheeui/next-playground test     # build, then end-to-end test
```

The test script builds first, because part of the test reads the prerendered HTML
Next.js produced for `app/page.tsx` and `app/substitution/page.tsx`.

The gallery itself lives in `packages/e2e-gallery`; this application contributes
only what makes it a Next.js application.
