import { PlaygroundApp } from "./playground";
import { AppLink } from "./router-link";

/**
 * The playground's application tree.
 *
 * The client entry and the server-rendering entry both render this, so the
 * server markup and the client's first render describe the same tree, which is
 * what makes the hydration check in the end-to-end test meaningful.
 *
 * The application is the shared playground application: this file supplies the
 * playground's own link adapter and nothing else, and the configuration, the
 * screens and the provider come from the shared package.
 *
 * @returns The application.
 */
export function App() {
  return (
    <PlaygroundApp
      title="AsheeUI on Vite"
      linkComponent={AppLink}
      linkProps={{ "data-vite-link": "true" }}
      imageProps={{ "data-vite-image": "true" }}
    />
  );
}
