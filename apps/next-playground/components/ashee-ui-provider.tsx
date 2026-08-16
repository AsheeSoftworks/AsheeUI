import type { ReactNode } from "react";
import { AsheeUIProvider } from "@ashee/ui";
import { config } from "../asheeui-config";

export interface AsheeProviderProps {
  children: ReactNode;
}

export function AsheeProvider({ children }: AsheeProviderProps) {
  return (
    <AsheeUIProvider config={config}>
      {children}
    </AsheeUIProvider>
  );
}
