import { AsheeUIProvider } from "asheeui";
import type { ReactNode } from "react";

export interface AsheeProviderProps {
  children: ReactNode;
}

export function AsheeProvider({ children }: AsheeProviderProps) {
  return <AsheeUIProvider>{children}</AsheeUIProvider>;
}
