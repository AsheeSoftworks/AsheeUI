/**
 * Behaviour tests for the native Toast system.
 *
 * The tests state the system's contract: a screen shows a message through the hook and
 * the message appears above it, the conveniences name the type of message they show,
 * a reader can dismiss one, a message leaves by itself after the timeout its type
 * states, the queue stays within the limit the consumer configured, and a component
 * outside the provider shows nothing rather than failing.
 *
 * The system is tested with animations switched off, because the timing that matters
 * here is how long a message waits rather than how long it takes to fade. The
 * platform's animator reports its completion through a frame callback, and mixing that
 * into a test about a timeout would make the test about the frames.
 */

import { act, fireEvent, render } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { View } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { type ToastContextType, useToast } from "./ToastContext";
import { ToastProvider } from "./ToastProvider";

/** The toast API the last render received, which the tests drive directly. */
let api: ToastContextType;

/**
 * A screen that shows messages, standing in for an application's screen.
 *
 * @returns An empty probe element.
 */
function Probe(): ReactNode {
  api = useToast();

  return <View testID="probe" />;
}

/**
 * Render an application inside both providers.
 *
 * @param children - The application's tree.
 * @param config - The application's configuration, if it has one.
 * @param toastProps - The toast system's own props.
 * @returns The rendered tree and its queries.
 */
async function renderApp(
  children: ReactNode,
  config?: object,
  toastProps?: Record<string, unknown>,
) {
  return render(
    <AsheeNativeProvider config={config}>
      <ToastProvider animated={false} {...toastProps}>
        {children}
      </ToastProvider>
    </AsheeNativeProvider>,
  );
}

describe("Native Toast", () => {
  it("shows a message a screen asked for, above what the reader is doing", async () => {
    const view = await renderApp(<Probe />);

    await act(async () => {
      api.success("Invoice saved");
    });

    expect(view.getByText("Invoice saved")).toBeTruthy();
    expect(view.getByLabelText("Notifications")).toBeTruthy();
  });

  it("names the type of message each convenience shows", async () => {
    const view = await renderApp(<Probe />);

    await act(async () => {
      api.error("Payment failed");
    });

    expect(
      (view.getByText("Payment failed").props as { className?: string })
        .className,
    ).toContain("text-danger");
  });

  it("draws the type's own glyph beside the message", async () => {
    const view = await renderApp(<Probe />);

    await act(async () => {
      api.success("Invoice saved");
    });

    // The glyph repeats the colour, so it is decoration and is kept out of the
    // announcement; asking for it means asking for hidden elements.
    expect(view.getByText("✓", { includeHiddenElements: true })).toBeTruthy();
  });

  it("lets a reader dismiss a message", async () => {
    const view = await renderApp(<Probe />);

    await act(async () => {
      api.info("Draft saved");
    });

    await act(async () => {
      fireEvent.press(
        view.getByRole("button", { name: "Dismiss notification" }),
      );
    });

    expect(view.queryByText("Draft saved")).toBeNull();
  });

  it("lets a message leave by itself after the timeout its type states", async () => {
    jest.useFakeTimers();

    const view = await renderApp(<Probe />, undefined, {
      defaultTimeout: 3000,
    });

    await act(async () => {
      api.info("Draft saved");
    });

    expect(view.getByText("Draft saved")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(view.queryByText("Draft saved")).toBeNull();

    jest.useRealTimers();
  });

  it("keeps a message that states no timeout until it is dismissed", async () => {
    jest.useFakeTimers();

    const view = await renderApp(<Probe />);

    await act(async () => {
      api.toast({ message: "No rush", timeout: 0 });
    });

    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });

    expect(view.getByText("No rush")).toBeTruthy();

    jest.useRealTimers();
  });

  it("keeps the queue within the limit the consumer configured", async () => {
    const view = await renderApp(<Probe />, undefined, { maxToasts: 2 });

    await act(async () => {
      api.info("First");
      api.info("Second");
      api.info("Third");
    });

    // The message that has waited longest leaves, so the queue holds what a reader is
    // about to read rather than what they have already missed.
    expect(view.queryByText("First")).toBeNull();
    expect(view.getByText("Second")).toBeTruthy();
    expect(view.getByText("Third")).toBeTruthy();
  });

  it("empties the queue when the application asks it to", async () => {
    const view = await renderApp(<Probe />);

    await act(async () => {
      api.info("First");
      api.info("Second");
    });

    await act(async () => {
      api.clearToasts();
    });

    expect(view.queryByText("First")).toBeNull();
    expect(view.queryByText("Second")).toBeNull();
  });

  it("resolves where messages appear through the cascade", async () => {
    const view = await renderApp(<Probe />, {
      components: { toast: { placement: "top-left" } },
    });

    await act(async () => {
      api.info("Draft saved");
    });

    expect(
      (view.getByLabelText("Notifications").props as { className?: string })
        .className,
    ).toContain("top-0");
  });

  it("shows nothing rather than failing when a screen has no provider above it", async () => {
    const view = await render(
      <AsheeNativeProvider>
        <Probe />
      </AsheeNativeProvider>,
    );

    expect(api.toasts).toEqual([]);
    expect(api.toast("Nowhere")).toBe("");
    expect(() => api.success("Nowhere")).not.toThrow();
    expect(view.queryByText("Nowhere")).toBeNull();
  });
});
