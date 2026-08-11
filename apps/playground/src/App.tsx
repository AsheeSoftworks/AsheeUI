import { useState } from "react";
import ConfigTestPage from "./pages/ConfigTestPage";
// import PlaygroundGlobalPage from "./pages/PlaygroundGlobal";
// import PlaygroundLocalPage from "./pages/PlaygroundLocal";
import LocalPropsTestPage from "./pages/LocalPropsTestPage";

// import { GlobalsPage } from "./pages/globals-page";
// import { LocalOverridesPage } from "./pages/local-overrides-page";

function App() {
  const [page, setPage] = useState<"globals" | "local">("globals");

  return (
    <div>
      {/* Plain native buttons on purpose — this switcher sits outside what's being tested */}
      <div className="fixed right-4 top-4 z-50 flex gap-2 scrollable">
        <button
          type="button"
          onClick={() => setPage("globals")}
          className="rounded-md border px-3 py-1.5 text-sm">
          Globals only
        </button>
        <button
          type="button"
          onClick={() => setPage("local")}
          className="rounded-md border px-3 py-1.5 text-sm">
          Local overrides
        </button>
      </div>
      {/* {page === "globals" ? <GlobalsPage /> : <LocalOverridesPage />} */}
      {page === "globals" ? <ConfigTestPage /> : <LocalPropsTestPage />}
    </div>
  );
}

export default App;
