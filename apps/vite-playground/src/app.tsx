import { Gallery } from "@asheeui/e2e-gallery";
import { AsheeUIProvider } from "asheeui";
import { playgroundConfig } from "./playground-config";
import { AppLink } from "./router-link";

/**
 * The playground's application tree.
 *
 * The client entry and the server-rendering entry both render this, so the
 * server markup and the client's first render describe the same tree, which is
 * what makes the hydration check in the end-to-end test meaningful.
 *
 * @returns The application, wrapped in the provider.
 */
export function App() {
  return (
    <AsheeUIProvider config={playgroundConfig}>
      <Gallery
        title="AsheeUI on Vite"
        linkComponent={AppLink}
        linkProps={{ "data-vite-link": "true" }}
        imageProps={{ "data-vite-image": "true" }}
      />
    </AsheeUIProvider>
  );
}
