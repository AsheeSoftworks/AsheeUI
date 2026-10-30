import { describe, expect, it, vi } from "vitest";
import { TOAST_ANIMATION_STATE } from "../../../styles/toast";
import {
  createUser,
  fireEvent,
  makeComponentConfig,
  makeConfig,
  renderWithProvider,
  screen,
  useFakeTimers,
  waitFor,
} from "../../../test";
import { useToast } from "./ToastContext";
import { ToastItem } from "./ToastItem";
import { ToastProvider } from "./ToastProvider";
import { FALLBACK_TOAST_CONFIG } from "./toast-config";

/** Renders a button that raises a notification through the toast context. */
function NotifyButton() {
  const { success } = useToast();

  return (
    <button type="button" onClick={() => success("Saved successfully")}>
      Notify
    </button>
  );
}

/** Probes the hook without a provider to prove it degrades safely. */
function OutsideProviderProbe() {
  const { success, toasts } = useToast();

  return (
    <span data-testid="probe">{`${success("ignored")}|${toasts.length}`}</span>
  );
}

/** Probes the defaults a provider resolved from the application's configuration. */
function DefaultsProbe() {
  const { defaultVariant } = useToast();

  return <span data-testid="variant">{defaultVariant}</span>;
}

/** Raises one message in each of two placements, so two stacks exist at once. */
function PlacementNotifier() {
  const { success } = useToast();

  return (
    <>
      <button type="button" onClick={() => success("Top message")}>
        Top
      </button>
      <button
        type="button"
        onClick={() => success("Bottom message", { placement: "bottom-left" })}>
        Bottom
      </button>
    </>
  );
}

/** The item props a test states, leaving only what it is about to vary. */
const ITEM = {
  id: "toast-1",
  message: "Saved successfully",
  placement: "top-right",
  size: "md",
  variant: "bordered",
  radius: "md",
} as const;

describe("Toast", () => {
  // The warning is stated once per module, so the first test that reaches
  // `useToast` without a provider has to be this one.
  it("warns once in development when it is used without a provider", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      const first = renderWithProvider(<OutsideProviderProbe />);
      first.unmount();
      const second = renderWithProvider(<OutsideProviderProbe />);
      second.unmount();

      expect(warn).toHaveBeenCalledTimes(1);
      expect(String(warn.mock.calls[0]?.[0])).toContain("ToastProvider");
    } finally {
      warn.mockRestore();
    }
  });

  it("degrades safely when there is no provider", () => {
    const { getByTestId, queryByText } = renderWithProvider(
      <OutsideProviderProbe />,
    );

    expect(getByTestId("probe")).toHaveTextContent("|0");
    expect(queryByText("ignored")).toBeNull();
  });

  it("renders its children inside the provider", () => {
    const { getByText } = renderWithProvider(
      <ToastProvider>
        <span>Application content</span>
      </ToastProvider>,
    );

    expect(getByText("Application content")).toBeInTheDocument();
  });

  it("shows a notification and dismisses it from its own control", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <ToastProvider>
        <NotifyButton />
      </ToastProvider>,
    );

    await user.click(getByRole("button", { name: "Notify" }));

    expect(await screen.findByText("Saved successfully")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    );

    await waitFor(() => {
      expect(screen.queryByText("Saved successfully")).toBeNull();
    });
  });

  it("animates a manual dismissal before it removes the message", () => {
    const timers = useFakeTimers();

    try {
      const onDismiss = vi.fn();
      const { getByRole } = renderWithProvider(
        <ToastItem {...ITEM} animated onDismiss={onDismiss} />,
      );

      fireEvent.click(getByRole("button", { name: "Dismiss notification" }));

      // The exit keyframe is drawn while the message is still mounted; it is the
      // removal that the animation delays.
      expect(onDismiss).not.toHaveBeenCalled();
      expect(getByRole("status").className).toContain(
        TOAST_ANIMATION_STATE["top-right"].exit,
      );

      timers.advance(150);

      expect(onDismiss).toHaveBeenCalledWith(ITEM.id);
    } finally {
      timers.restore();
    }
  });

  it("removes a message at once when it does not animate", () => {
    const onDismiss = vi.fn();
    const { getByRole } = renderWithProvider(
      <ToastItem {...ITEM} animated={false} onDismiss={onDismiss} />,
    );

    fireEvent.click(getByRole("button", { name: "Dismiss notification" }));

    expect(onDismiss).toHaveBeenCalledWith(ITEM.id);
  });

  it("animates when the configuration turns animation on", () => {
    const { getByRole } = renderWithProvider(
      <ToastItem {...ITEM} onDismiss={() => undefined} />,
      { config: makeComponentConfig("toast", { animated: true }) },
    );

    // The animation class and the timer read the same resolved value, so a toast
    // the configuration animates draws its entrance.
    expect(getByRole("status").className).toContain(
      TOAST_ANIMATION_STATE["top-right"].enter,
    );
  });

  it("does not animate when the configuration turns animation off", () => {
    const { getByRole } = renderWithProvider(
      <ToastItem {...ITEM} onDismiss={() => undefined} />,
      { config: makeComponentConfig("toast", { animated: false }) },
    );

    expect(getByRole("status").className).not.toContain(
      TOAST_ANIMATION_STATE["top-right"].enter,
    );
  });

  it("shows several notifications at once", async () => {
    const user = createUser();
    const { getAllByRole } = renderWithProvider(
      <ToastProvider>
        <NotifyButton />
        <NotifyButton />
      </ToastProvider>,
    );

    const triggers = getAllByRole("button", { name: "Notify" });
    await user.click(triggers[0]!);
    await user.click(triggers[1]!);

    expect(await screen.findAllByText("Saved successfully")).toHaveLength(2);
  });

  it("dismisses automatically after the configured timeout", async () => {
    const timers = useFakeTimers({ shouldAdvanceTime: true });

    try {
      const user = createUser({ advanceTimers: vi.advanceTimersByTime });
      const { getByRole } = renderWithProvider(
        <ToastProvider defaultTimeout={1000}>
          <NotifyButton />
        </ToastProvider>,
      );

      await user.click(getByRole("button", { name: "Notify" }));
      expect(screen.getByText("Saved successfully")).toBeInTheDocument();

      timers.advance(5000);

      expect(screen.queryByText("Saved successfully")).toBeNull();
    } finally {
      timers.restore();
    }
  });

  it("announces notifications politely to assistive technology", async () => {
    const user = createUser();
    renderWithProvider(
      <ToastProvider>
        <NotifyButton />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Notify" }));

    // The notification is a polite live region, and the stack it lives in is a
    // labelled region so assistive technology can place the announcement.
    const notification = await screen.findByRole("status");
    expect(notification).toHaveTextContent("Saved successfully");
    expect(
      screen.getByRole("region", { name: "Notifications (top right)" }),
    ).toContainElement(notification);
  });

  it("names each placement's stack, so two placements are not one repeated landmark", async () => {
    const user = createUser();
    renderWithProvider(
      <ToastProvider>
        <PlacementNotifier />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Top" }));
    await user.click(screen.getByRole("button", { name: "Bottom" }));

    await screen.findByText("Bottom message");

    const names = screen
      .getAllByRole("region")
      .map((region) => region.getAttribute("aria-label"));

    expect(names.sort()).toEqual([
      "Notifications (bottom left)",
      "Notifications (top right)",
    ]);
  });

  it("follows the application's default variant, the way an alert does", () => {
    const { getByTestId } = renderWithProvider(
      <ToastProvider>
        <DefaultsProbe />
      </ToastProvider>,
      { config: makeConfig({ defaultVariant: "solid" }) },
    );

    expect(getByTestId("variant")).toHaveTextContent("solid");
  });

  it("resolves the shipped default variant when the application states none", () => {
    const { getByTestId } = renderWithProvider(
      <ToastProvider>
        <DefaultsProbe />
      </ToastProvider>,
    );

    expect(getByTestId("variant")).toHaveTextContent("faded");
  });

  it("still lets the component tier state a variant of its own", () => {
    const { getByTestId } = renderWithProvider(
      <ToastProvider>
        <DefaultsProbe />
      </ToastProvider>,
      {
        config: makeConfig({
          defaultVariant: "solid",
          components: { toast: { variant: "bordered" } },
        }),
      },
    );

    expect(getByTestId("variant")).toHaveTextContent("bordered");
  });

  it("falls back to the bordered treatment its contract documents", () => {
    expect(FALLBACK_TOAST_CONFIG.variant).toBe("bordered");
  });
});
