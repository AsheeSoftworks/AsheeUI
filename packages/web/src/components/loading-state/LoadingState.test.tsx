/**
 * Behaviour tests for the loading presentation.
 *
 * The tests state the pattern's contract: the region announces itself as a
 * status, it says what is loading, it claims room so the page does not jump, and
 * every option resolves through the configuration cascade.
 */

import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
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

    expect(getByRole("status").className).toContain("min-h-24");
    expect(container.querySelector("svg")).toBeTruthy();
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
