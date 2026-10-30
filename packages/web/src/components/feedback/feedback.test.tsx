import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  LOADING_STATE_CLASS,
  LOADING_STATE_SIZE_CLASS,
} from "../../styles/loading-state";
import { SPACE_MIN_HEIGHT_CLASS } from "../../styles/portable";
import { SPINNER_SIZE_CLASS } from "../../styles/spinner";
import { TOAST_ANIMATION_STATE } from "../../styles/toast";
import {
  createUser,
  expectHydrationClean,
  fireEvent,
  makeComponentConfig,
  makeConfig,
  renderToServerString,
  renderWithProvider,
  screen,
  useFakeTimers,
  userEvent,
  waitFor,
  within,
} from "../../test";
import { Alert } from "./alert/Alert";
import { EmptyState } from "./empty-state/EmptyState";
import { ErrorState } from "./error-state/ErrorState";
import {
  LoadingState,
  type LoadingStateProps,
} from "./loading-state/LoadingState";
import { defaultLoadingStateConfig } from "./loading-state/loading-state-config";
import { Skeleton } from "./skeleton/Skeleton";
import { Spinner } from "./spinner/spinner";
import { useToast } from "./toast/ToastContext";
import { ToastItem } from "./toast/ToastItem";
import { ToastProvider } from "./toast/ToastProvider";
import { FALLBACK_TOAST_CONFIG } from "./toast/toast-config";

describe("Alert", () => {
  it("renders its title and message", () => {
    const { getByText } = renderWithProvider(
      <Alert title="Payment failed">The card was declined.</Alert>,
    );

    expect(getByText("Payment failed")).toBeInTheDocument();
    expect(getByText("The card was declined.")).toBeInTheDocument();
  });

  it("announces an error urgently and an informational message politely", () => {
    const error = renderWithProvider(
      <Alert type="error" title="Failed">
        Declined
      </Alert>,
    );
    const info = renderWithProvider(
      <Alert type="info" title="Update">
        A new version is available.
      </Alert>,
    );

    expect(within(error.container).getByRole("alert")).toBeInTheDocument();
    expect(within(info.container).getByRole("status")).toBeInTheDocument();
  });

  it("lets the consumer override the announcement role", () => {
    const { container } = renderWithProvider(
      <Alert type="error" role="status">
        Declined
      </Alert>,
    );

    expect(within(container).getByRole("status")).toBeInTheDocument();
    expect(within(container).queryByRole("alert")).toBeNull();
  });

  it("does not take focus and adds no focusable control of its own", () => {
    const { container } = renderWithProvider(
      <Alert title="Note">Something to read.</Alert>,
    );
    const alert = within(container).getByRole("status");

    expect(alert).not.toHaveFocus();
    expect(document.activeElement).toBe(document.body);
    expect(alert.querySelector("button")).toBeNull();
  });

  it("offers a labelled dismiss control only when it is closable", async () => {
    const user = createUser();
    const onClose = vi.fn();
    const closable = renderWithProvider(
      <Alert isClosable onClose={onClose} title="Update">
        A new version is available.
      </Alert>,
    );
    const plain = renderWithProvider(<Alert title="Update">Read only</Alert>);

    const dismiss = within(closable.container).getByRole("button", {
      name: "Dismiss alert",
    });

    expect(within(plain.container).queryByRole("button")).toBeNull();

    await user.click(dismiss);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("takes the dismiss control's name from the consumer", () => {
    const { getByRole } = renderWithProvider(
      <Alert isClosable onClose={() => {}} closeLabel="Dismiss update notice">
        A new version is available.
      </Alert>,
    );

    expect(
      getByRole("button", { name: "Dismiss update notice" }),
    ).toBeInTheDocument();
  });

  it("resolves the configured intent and honours a prop override", () => {
    const configured = renderWithProvider(<Alert>Body</Alert>, {
      config: makeComponentConfig("alert", { type: "warning" }),
    });
    const overridden = renderWithProvider(<Alert type="success">Body</Alert>, {
      config: makeComponentConfig("alert", { type: "warning" }),
    });

    expect(within(configured.container).getByRole("alert")).toBeInTheDocument();
    expect(
      within(overridden.container).getByRole("status"),
    ).toBeInTheDocument();
  });

  it("uses the registered radius and honours a radius override", () => {
    const { container } = renderWithProvider(
      <>
        <Alert id="default-radius">Body</Alert>
        <Alert id="square" radius="none">
          Body
        </Alert>
      </>,
    );

    expect(container.querySelector("#default-radius")?.className).toContain(
      "rounded-md",
    );
    expect(container.querySelector("#square")?.className).toContain(
      "rounded-none",
    );
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(
      <Alert type="error" title="Payment failed">
        The card was declined.
      </Alert>,
    );
    expectHydrationClean(
      <Alert isClosable onClose={() => {}} title="Update">
        A new version is available.
      </Alert>,
    );
  });
});

/** Behaviour tests for the EmptyState pattern. */
describe("EmptyState", () => {
  it("renders its title, description and action", () => {
    const { getByText, getByRole } = renderWithProvider(
      <EmptyState
        title="No campaigns match that filter"
        description="Try a different name."
        primaryAction={{ label: "Clear filters" }}
      />,
    );

    expect(getByText("No campaigns match that filter")).toBeDefined();
    expect(getByText("Try a different name.")).toBeDefined();
    expect(getByRole("button", { name: "Clear filters" })).toBeDefined();
  });

  it("keeps its live-region role off until it is asked for one", () => {
    const { container: silent } = renderWithProvider(
      <EmptyState title="Empty" />,
    );
    expect(silent.firstElementChild?.getAttribute("role")).toBeNull();

    const { container: live } = renderWithProvider(
      <EmptyState title="Failed" role="alert" />,
    );

    expect(live.firstElementChild?.getAttribute("role")).toBe("alert");
  });

  it("takes its announcement from configuration, the way ErrorState does", () => {
    const { container } = renderWithProvider(<EmptyState title="Empty" />, {
      config: makeComponentConfig("emptystate", { role: "status" }),
    });

    expect(container.firstElementChild?.getAttribute("role")).toBe("status");
  });

  it("lets an instance announcement win over the configured one", () => {
    const { container } = renderWithProvider(
      <EmptyState title="Empty" role="alert" />,
      { config: makeComponentConfig("emptystate", { role: "status" }) },
    );

    expect(container.firstElementChild?.getAttribute("role")).toBe("alert");
  });

  it("renders its title as an h2 by default and at the level it is asked for", () => {
    const first = renderWithProvider(<EmptyState title="Empty" />);

    expect(first.getByText("Empty").tagName).toBe("H2");
    first.unmount();

    const nested = renderWithProvider(
      <EmptyState title="Empty" titleAs="h4" />,
    );

    expect(nested.getByText("Empty").tagName).toBe("H4");
  });

  it("colours its icon badge by tone", () => {
    const { container } = renderWithProvider(
      <EmptyState title="Failed" type="error" icon={<span>!</span>} />,
    );

    expect(container.innerHTML).toContain("bg-danger/10");
  });

  it("draws a panel only when it is asked to", () => {
    const { container: plain } = renderWithProvider(
      <EmptyState title="Empty" />,
    );
    expect(plain.firstElementChild?.className).not.toContain("border-border");

    const { container: panel } = renderWithProvider(
      <EmptyState title="Empty" panel />,
    );

    expect(panel.firstElementChild?.className).toContain("border-border");
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(
      <EmptyState title="Empty" icon={<span>?</span>} />,
      {
        config: makeComponentConfig("emptystate", {
          type: "warning",
          size: "lg",
          panel: true,
        }),
      },
    );

    expect(container.innerHTML).toContain("bg-warning/10");
    expect(container.firstElementChild?.className).toContain("p-10");
    expect(container.firstElementChild?.className).toContain("border-border");
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <EmptyState title="Nothing here yet" role="status" />,
    );

    expect(html).toContain('role="status"');
    expect(html).toContain("Nothing here yet");
    expectHydrationClean(<EmptyState title="Nothing here yet" panel />);
  });
});

/**
 * Behaviour tests for the failed-region presentation.
 *
 * The tests state the pattern's contract: what failed is announced, the reader
 * is offered a way to try again, the technical detail stays behind a disclosure,
 * and every option resolves through the configuration cascade.
 */
describe("ErrorState", () => {
  it("announces the failure as an alert", () => {
    const { getByRole } = renderWithProvider(
      <ErrorState
        title="Invoices could not be loaded"
        description="The request timed out."
      />,
    );
    const alert = getByRole("alert");

    expect(alert).toHaveTextContent("Invoices could not be loaded");
    expect(alert).toHaveTextContent("The request timed out.");
  });

  it("stays silent when it is part of the page rather than a change to it", () => {
    const { queryByRole, getByText } = renderWithProvider(
      <ErrorState title="Page not found" role="none" />,
    );

    expect(queryByRole("alert")).toBeNull();
    expect(getByText("Page not found")).toBeTruthy();
  });

  it("stays silent under a configured empty-state announcement", () => {
    // A failure stated as `none` is a deliberate silence, so it must not inherit a
    // `components.emptystate.role` the empty presentation would resolve.
    const { queryByRole, getByText } = renderWithProvider(
      <ErrorState title="Page not found" role="none" />,
      {
        config: makeConfig({
          components: { emptystate: { role: "status" } },
        }),
      },
    );

    expect(queryByRole("status")).toBeNull();
    expect(queryByRole("alert")).toBeNull();
    expect(getByText("Page not found")).toBeTruthy();
  });

  it("offers a retry control that runs the handler", async () => {
    const onRetry = vi.fn();
    const { getByRole, queryByRole } = renderWithProvider(
      <ErrorState title="Failed" onRetry={onRetry} />,
    );
    const user = userEvent.setup();

    expect(queryByRole("button", { name: "Try again" })).toBeTruthy();
    await user.click(getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("offers no retry control when there is nothing to run", () => {
    const { queryByRole } = renderWithProvider(<ErrorState title="Failed" />);

    expect(queryByRole("button", { name: "Try again" })).toBeNull();
  });

  it("keeps the configured actions ahead of the retry, in the documented order", () => {
    const { getAllByRole } = renderWithProvider(
      <ErrorState
        title="Failed"
        primaryAction={{ label: "Go to invoices" }}
        secondaryAction={{ label: "Read the docs" }}
        onRetry={() => undefined}
      />,
    );

    // The configured pair is the consumer's statement of where the reader can go
    // and leads the row; the retry is the framework's recovery path and follows.
    // When nothing is configured, the retry is the only control and therefore first.
    const names = getAllByRole("button").map((button) => button.textContent);

    expect(names).toEqual(["Go to invoices", "Read the docs", "Try again"]);
  });

  it("takes a node as its retry label, so the control can carry an icon", () => {
    const { getByRole } = renderWithProvider(
      <ErrorState
        title="Failed"
        onRetry={() => undefined}
        retryLabel={
          <>
            <span aria-hidden="true">↻</span> Reload invoices
          </>
        }
      />,
    );

    expect(
      getByRole("button", { name: /Reload invoices/ }),
    ).toBeInTheDocument();
  });

  it("takes a node as its disclosure label", () => {
    const { getByText } = renderWithProvider(
      <ErrorState
        title="Failed"
        detail="detail"
        detailLabel={<em>What went wrong</em>}
      />,
    );

    expect(getByText("What went wrong").tagName).toBe("EM");
  });

  it("renders its title at the outline level it is asked for", () => {
    const first = renderWithProvider(<ErrorState title="Failed" />);

    expect(first.getByText("Failed").tagName).toBe("H2");
    first.unmount();

    const nested = renderWithProvider(
      <ErrorState title="Failed" titleAs="h4" />,
    );

    expect(nested.getByText("Failed").tagName).toBe("H4");
  });

  it("keeps the technical message behind a disclosure", () => {
    const { getByText, queryByText } = renderWithProvider(
      <ErrorState title="Failed" detail="ECONNRESET at 10.0.0.4" />,
    );

    const summary = getByText("Technical details");
    expect(summary.tagName).toBe("SUMMARY");
    expect(summary.closest("details")).toBeTruthy();
    expect(queryByText("ECONNRESET at 10.0.0.4")).toBeTruthy();
  });

  it("renders no disclosure when there is no detail", () => {
    const { queryByText } = renderWithProvider(<ErrorState title="Failed" />);

    expect(queryByText("Technical details")).toBeNull();
  });

  it("takes its wording, its density and its announcement from configuration", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <ErrorState title="Failed" detail="detail" onRetry={() => undefined} />,
      {
        config: makeComponentConfig("errorstate", {
          retryLabel: "Reload",
          detailLabel: "What went wrong",
          role: "status",
          panel: false,
        }),
      },
    );

    expect(getByRole("button", { name: "Reload" })).toBeTruthy();
    expect(getByRole("status")).toHaveTextContent("Failed");
    expect(queryByRole("alert")).toBeNull();
    expect(getByRole("status").className).not.toContain("border-border");
  });

  it("lets an instance prop win over the configured value", () => {
    const { getByRole } = renderWithProvider(
      <ErrorState title="Failed" role="alert" />,
      { config: makeComponentConfig("errorstate", { role: "none" }) },
    );

    expect(getByRole("alert")).toBeTruthy();
  });

  it("renders the element it is asked for, carries the consumer's class and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { container, getByRole } = renderWithProvider(
      <ErrorState
        as="section"
        ref={ref}
        className="bg-primary"
        title="Failed"
      />,
    );

    expect(container.firstElementChild?.tagName).toBe("SECTION");
    expect(getByRole("alert").className).toContain("bg-primary");
    expect(ref.current).toBe(container.firstElementChild);
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const markup = renderToServerString(
      <ErrorState title="Failed" detail="detail" onRetry={() => undefined} />,
    );

    expect(markup).toContain("Failed");
    expect(markup).toContain("Technical details");
    expectHydrationClean(<ErrorState title="Failed" />);
  });
});

/**
 * Behaviour tests for the loading presentation.
 *
 * The tests state the pattern's contract: the region announces itself as a
 * status, it says what is loading, it claims room so the page does not jump, and
 * every option resolves through the configuration cascade.
 */
describe("LoadingState", () => {
  /** One Tailwind spacing step, in rem: the scale counts four steps to a rem. */
  const spacingStepRem = (steps: number): number => steps / 4;

  /** The vertical padding a `py-*` utility adds above and below, in rem. */
  function verticalPaddingRem(utility: string): number {
    const step = /^py-(\d+(?:\.\d+)?)$/.exec(utility)?.[1];

    if (!step) {
      throw new Error(`not a vertical padding utility: ${utility}`);
    }

    return spacingStepRem(Number(step)) * 2;
  }

  /** The height an `h-*`/`w-*` utility asks for, in rem. */
  function squareRem(utility: string): number {
    const step = /^w-(\d+(?:\.\d+)?)/.exec(utility)?.[1];

    if (!step) {
      throw new Error(`not a square size utility: ${utility}`);
    }

    return spacingStepRem(Number(step));
  }

  /** The line height `Typography role="body-sm"` resolves to: `text-sm` at
   * `leading-normal`, which is 0.875rem × 1.5. */
  const LABEL_LINE_HEIGHT_REM = 0.875 * 1.5;

  it("announces itself as a status and says what is loading", () => {
    const { getByRole } = renderWithProvider(
      <LoadingState label="Loading invoices" />,
    );
    const status = getByRole("status");

    expect(status).toHaveTextContent("Loading invoices");
  });

  it("says it is loading when it is given nothing else to say", () => {
    const { getByRole } = renderWithProvider(<LoadingState />);

    expect(getByRole("status")).toHaveTextContent("Loading");
  });

  it("claims room by default, so the page does not jump", () => {
    const { getByRole, container } = renderWithProvider(<LoadingState />);

    expect(getByRole("status").className).toContain("min-h-48");
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("claims a floor taller than the content it holds at the default density", () => {
    // The registered pairing is what an application that states nothing gets, so
    // the floor it resolves to has to bind above the padding, the indicator and the
    // label the same defaults draw. A claim under that height reserves nothing.
    const floorToken = defaultLoadingStateConfig.minHeight ?? "md";
    const density = defaultLoadingStateConfig.size ?? "md";

    const floor = spacingStepRem(
      Number(/^min-h-(\d+)$/.exec(SPACE_MIN_HEIGHT_CLASS[floorToken])?.[1]),
    );
    const gap = spacingStepRem(
      Number(/gap-(\d+)/.exec(LOADING_STATE_CLASS)?.[1]),
    );
    const content =
      verticalPaddingRem(LOADING_STATE_SIZE_CLASS[density]) +
      squareRem(SPINNER_SIZE_CLASS[density]) +
      gap +
      LABEL_LINE_HEIGHT_REM;

    expect(floor).toBeGreaterThan(content);
  });

  it("owns its announcement, so an instance cannot turn the wait into an alert", () => {
    // The state draws `role="status"` itself. The ARIA role is omitted from the
    // inherited attributes for the same reason `Typography` omits it, so this does
    // not compile; the rendered region is asserted by the first test.
    // @ts-expect-error - `role` belongs to the component, not to the consumer
    const props: LoadingStateProps = { role: "alert" };

    expect(props).toBeDefined();
  });

  it("takes a node as its label, so the sentence can carry a glyph", () => {
    const { getByRole } = renderWithProvider(
      <LoadingState
        label={
          <>
            <span aria-hidden="true">↻</span> Loading invoices
          </>
        }
      />,
    );

    expect(getByRole("status")).toHaveTextContent("Loading invoices");
  });

  it("takes the room, the density and the wording from its props", () => {
    const { getByRole } = renderWithProvider(
      <LoadingState
        label="Fetching"
        description="This takes a moment."
        size="lg"
        minHeight="lg"
        panel
      />,
    );
    const status = getByRole("status");

    expect(status).toHaveTextContent("Fetching");
    expect(status).toHaveTextContent("This takes a moment.");
    expect(status.className).toContain("min-h-72");
    expect(status.className).toContain("py-12");
    expect(status.className).toContain("border-border");
  });

  it("shows the consumer's own indicator in place of the spinner", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <LoadingState indicator={<span>43 percent</span>} />,
    );

    expect(getByRole("status")).toHaveTextContent("43 percent");
    expect(queryByRole("status")?.querySelector("svg")).toBeNull();
  });

  it("resolves its defaults through configuration", () => {
    const { getByRole } = renderWithProvider(<LoadingState />, {
      config: makeComponentConfig("loadingstate", {
        label: "Fetching invoices",
        panel: true,
        minHeight: "md",
        size: "sm",
      }),
    });
    const status = getByRole("status");

    expect(status).toHaveTextContent("Fetching invoices");
    expect(status.className).toContain("border-border");
    expect(status.className).toContain("min-h-48");
  });

  it("lets an instance prop win over the configured value", () => {
    const { getByRole } = renderWithProvider(
      <LoadingState label="Fetching" />,
      {
        config: makeComponentConfig("loadingstate", { label: "Loading" }),
      },
    );

    expect(getByRole("status")).toHaveTextContent("Fetching");
    expect(getByRole("status")).not.toHaveTextContent("Loading");
  });

  it("renders the element it is asked for, carries the consumer's class and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { getByRole } = renderWithProvider(
      <LoadingState as="section" ref={ref} className="border" />,
    );
    const status = getByRole("status");

    expect(status.tagName).toBe("SECTION");
    expect(status.className).toContain("border");
    expect(ref.current).toBe(status);
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(renderToServerString(<LoadingState label="Loading" />)).toContain(
      "status",
    );
    expectHydrationClean(<LoadingState label="Loading invoices" />);
  });
});

describe("Skeleton", () => {
  it("renders a decorative placeholder hidden from assistive technology", () => {
    const { container } = renderWithProvider(
      <Skeleton id="placeholder" className="h-4 w-40" />,
    );
    const placeholder = container.querySelector("#placeholder") as HTMLElement;

    expect(placeholder).toHaveAttribute("aria-hidden", "true");
    expect(placeholder).not.toHaveAttribute("role");
    expect(placeholder).not.toHaveAttribute("aria-busy");
  });

  it("exposes a labelled busy status when it stands in for a loading region", () => {
    const { getByRole, getByText } = renderWithProvider(
      <Skeleton isBusy label="Loading invoices" />,
    );
    const status = getByRole("status");

    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).not.toHaveAttribute("aria-hidden");
    expect(getByText("Loading invoices")).toBeInTheDocument();
  });

  it("shimmers only through the reduced-motion-safe class", () => {
    const animated = renderWithProvider(<Skeleton id="animated" />);
    const still = renderWithProvider(
      <Skeleton id="still" isAnimated={false} />,
    );
    const animatedClass = (
      animated.container.querySelector("#animated") as HTMLElement
    ).className;
    const stillClass = (still.container.querySelector("#still") as HTMLElement)
      .className;

    expect(animatedClass).toContain("motion-safe:animate-pulse");
    expect(animatedClass).not.toMatch(/(^|\s)animate-pulse/);
    expect(stillClass).not.toContain("animate-pulse");
  });

  it("honours the configured animation setting", () => {
    const { container } = renderWithProvider(<Skeleton id="configured" />, {
      config: makeComponentConfig("skeleton", { isAnimated: false }),
    });
    const placeholder = container.querySelector("#configured") as HTMLElement;

    expect(placeholder.className).not.toContain("animate-pulse");
  });

  it("uses the registered radius and honours a radius override", () => {
    const { container } = renderWithProvider(
      <>
        <Skeleton id="default-radius" />
        <Skeleton id="round" radius="full" />
      </>,
    );

    expect(container.querySelector("#default-radius")?.className).toContain(
      "rounded-sm",
    );
    expect(container.querySelector("#round")?.className).toContain(
      "rounded-full",
    );
  });

  it("composes with consumer sizing classes", () => {
    const { container } = renderWithProvider(
      <Skeleton id="sized" className="h-24 w-64" />,
    );
    const placeholder = container.querySelector("#sized") as HTMLElement;

    expect(placeholder.className).toContain("h-24");
    expect(placeholder.className).toContain("w-64");
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(<Skeleton className="h-4 w-40" />);
    expectHydrationClean(<Skeleton isBusy label="Loading invoices" />);
  });
});

describe("Spinner", () => {
  it("renders a decorative indicator hidden from assistive technology", () => {
    const { container } = renderWithProvider(<Spinner />);
    const svg = container.querySelector("svg");

    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("maps size and colour props to framework classes", () => {
    const small = renderWithProvider(
      <Spinner size="sm" />,
    ).container.querySelector("svg");
    const large = renderWithProvider(
      <Spinner size="lg" />,
    ).container.querySelector("svg");
    const danger = renderWithProvider(
      <Spinner color="danger" />,
    ).container.querySelector("svg");

    expect(small?.getAttribute("class")).not.toBe(large?.getAttribute("class"));
    expect(danger?.getAttribute("class")).toContain("text-danger");
  });

  it("applies the rotation speed from a prop", () => {
    const { container } = renderWithProvider(<Spinner speed="2s" />);

    expect(container.querySelector("svg")).toHaveStyle({
      animationDuration: "2s",
    });
  });

  it("applies the rotation speed from component configuration", () => {
    const { container } = renderWithProvider(<Spinner />, {
      config: makeComponentConfig("spinner", { speed: "3s" }),
    });

    expect(container.querySelector("svg")).toHaveStyle({
      animationDuration: "3s",
    });
  });

  it("lets consumer classes win over framework classes", () => {
    const { container } = renderWithProvider(
      <Spinner className="text-danger" />,
    );
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("class")).toContain("text-danger");
  });
});

describe("Toast", () => {
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
