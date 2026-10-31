/**
 * The Expo entry.
 *
 * The provider and the toast queue wrap the shell, exactly as they do on the web; the
 * theme, the configuration and every screen come from the same shared package.
 */
import { config } from "@asheeui/fitness-shared";
import { AsheeUIProvider, ToastProvider } from "asheeui";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MobileShell } from "./src/MobileShell";
import "./global.css";

export default function App() {
  return (
    <SafeAreaProvider>
      <AsheeUIProvider config={config}>
        <ToastProvider>
          <StatusBar style="auto" />
          <MobileShell />
        </ToastProvider>
      </AsheeUIProvider>
    </SafeAreaProvider>
  );
}
