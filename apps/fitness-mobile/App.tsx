/**
 * The Expo entry.
 *
 * The theme root loads the persisted definitions before the provider mounts; the provider,
 * toast queue and device shell then wrap the same shared screens as the web.
 */
import { ToastProvider } from "asheeui";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MobileShell } from "./src/MobileShell";
import { ThemeRoot } from "./src/ThemeRoot";
import "./global.css";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeRoot>
        <ToastProvider>
          <StatusBar style="auto" />
          <MobileShell />
        </ToastProvider>
      </ThemeRoot>
    </SafeAreaProvider>
  );
}
