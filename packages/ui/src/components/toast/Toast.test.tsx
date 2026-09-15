import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  renderWithProvider,
  screen,
  useFakeTimers,
  waitFor,
} from "../../test";
import { useToast } from "./ToastContext";
import { ToastProvider } from "./ToastProvider";

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

describe("Toast", () => {
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

  it("shows several notifications at once", async () => {
    const user = createUser();
    const { getAllByRole } = renderWithProvider(
      <ToastProvider>
        <NotifyButton />
        <NotifyButton />
      </ToastProvider>,
    );

    const triggers = getAllByRole("button", { name: "Notify" });
    await user.click(triggers[0]);
    await user.click(triggers[1]);

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
      screen.getByRole("region", { name: "Notifications" }),
    ).toContainElement(notification);
  });
});
