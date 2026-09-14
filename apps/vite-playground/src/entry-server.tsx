import { renderToString } from "react-dom/server";
import { App } from "./app";

/**
 * Renders the playground to markup, the way a Vite SSR deployment does.
 *
 * It is the entry a Node server would import, and the end-to-end test renders
 * through it rather than through its own render call, so the test exercises the
 * same code path a deployment uses.
 *
 * @returns The rendered markup.
 */
export function renderServer(): string {
  return renderToString(<App />);
}
