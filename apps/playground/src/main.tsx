import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AsheeUIProvider } from "@ashee/ui";
import { config } from "../asheeui-config.ts";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AsheeUIProvider config={config}>
      <App />
    </AsheeUIProvider>
  </StrictMode>,
);
