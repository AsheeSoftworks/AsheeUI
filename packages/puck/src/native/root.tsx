/**
 * The page shell a stored page renders into, on the platform.
 *
 * A block resolves its theme through the framework provider, so the shell supplies one
 * when the application has not. An existing provider is respected rather than nested, so
 * an application's own configuration keeps applying to a built page — a second provider
 * would replace the resolved configuration with the framework's own defaults.
 *
 * The shell is the platform's own view rather than a re-implementation of the web's
 * `<div>`: a page fills the screen it is drawn in, and the background it paints is the
 * framework's background role.
 */

import { AsheeNativeConfigContext, AsheeNativeProvider } from "@asheeui/native";
import { useContext } from "react";
import { View } from "react-native";
import type { AsheePuckRootProps } from "../shared";

/**
 * The published page's root.
 *
 * @param props - The page the builder composed.
 * @returns The page, inside the framework's provider when the application has none.
 */
export function PuckRoot({ children }: AsheePuckRootProps) {
  const existingConfig = useContext(AsheeNativeConfigContext);

  const page = <View className="bg-background flex-1 w-full">{children}</View>;

  return existingConfig ? (
    page
  ) : (
    <AsheeNativeProvider>{page}</AsheeNativeProvider>
  );
}
