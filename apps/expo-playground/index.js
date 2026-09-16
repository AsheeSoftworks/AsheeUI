import { registerRootComponent } from "expo";

import App from "./src/App";
import "./global.css";

// registerRootComponent points the platform at the application root, which is what
// makes the same entry work for a device, a simulator and the web export.
registerRootComponent(App);
