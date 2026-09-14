# AsheeUI Vite playground

One of the three playground applications that consume AsheeUI the way a real
project does. It is a client-rendered React application with an additional
server-rendering entry, and its end-to-end test is the proof that the library
works on Vite.

## What it proves

- The library resolves and builds through Vite with Tailwind CSS v4, using the
  consumer setup from the documentation (`@import "asheeui/styles"` and
  `AsheeUIProvider`).
- Every gallery section renders correctly on the server through
  `src/entry-server.tsx` and again after hydration, with no hydration error.
- The interactions a consumer performs (paging, tabs, accordion, dialog,
  tooltip) work once the markup has hydrated.
- A consumer's own link component reaches every component that renders a link:
  the playground substitutes a local link and the test asserts the marker it
  leaves behind.

## Running it

```bash
pnpm --filter @asheeui/vite-playground dev      # development server
pnpm --filter @asheeui/vite-playground build    # client build and SSR build
pnpm --filter @asheeui/vite-playground test     # end-to-end test
```

The gallery itself lives in `packages/e2e-gallery`; this application contributes
only what makes it a Vite application.
