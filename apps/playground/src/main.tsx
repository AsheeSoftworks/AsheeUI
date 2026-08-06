import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AsheeUIProvider } from "@ashee/ui";
import config from "../asheeui-config";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AsheeUIProvider config={config}>
      <App />
    </AsheeUIProvider>
  </StrictMode>,
);
