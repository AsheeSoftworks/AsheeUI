import { StrictMode } from "react";
import { AsheeUIProvider } from "asheeui";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AsheeUIProvider>
    <App />
      </AsheeUIProvider>
  </StrictMode>,
);
