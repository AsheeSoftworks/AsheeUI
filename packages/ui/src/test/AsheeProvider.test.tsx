import { render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AsheeUIProvider } from "../AsheeUIProvider";
import { useAshee } from "../libs/context";

function wrapper({ children }: { children: ReactNode }) {
  return <AsheeUIProvider>{children}</AsheeUIProvider>;
}

describe("AsheeUIProvider / useAshee", () => {
  it("exposes the library defaults when no config prop is passed", () => {
    const { result } = renderHook(() => useAshee(), { wrapper });
    expect(result.current.defaultRadius).toBe("md");
    expect(result.current.defaultColor).toBe("primary");
    expect(result.current.defaultVariant).toBe("solid");
    expect(result.current.defaultTheme).toBe("system");
  });

  it("merges a partial runtime config over the defaults", () => {
    const { result } = renderHook(() => useAshee(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AsheeUIProvider
          config={{
            defaultRadius: "lg",
            defaultColor: "success",
            defaultVariant: "bordered",
          }}>
          {children}
        </AsheeUIProvider>
      ),
    });

    expect(result.current.defaultRadius).toBe("lg");
    expect(result.current.defaultColor).toBe("success");
    expect(result.current.defaultVariant).toBe("bordered");
    // Values not overridden fall back to defaults.
    expect(result.current.defaultTheme).toBe("system");
  });

  it("lets nested consumers read the config through context", () => {
    const probe = vi.fn();
    function Consumer() {
      const config = useAshee();
      probe(config.defaultRadius);
      return <div data-testid="radius">{config.defaultRadius}</div>;
    }

    render(
      <AsheeUIProvider config={{ defaultRadius: "xl" }}>
        <Consumer />
      </AsheeUIProvider>,
    );

    expect(screenRadius()).toBe("xl");
    expect(probe).toHaveBeenCalledWith("xl");
  });

  it("throws a descriptive error when used outside of an AsheeUIProvider", () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    let caught: Error | undefined;
    function Probe() {
      try {
        useAshee();
      } catch (err) {
        caught = err as Error;
      }
      return null;
    }

    render(<Probe />);

    expect(caught?.message).toContain("AsheeUIProvider");
    errorSpy.mockRestore();
  });
});

function screenRadius(): string | null {
  return document.querySelector('[data-testid="radius"]')?.textContent ?? null;
}
