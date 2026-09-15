import { describe, expect, it } from "vitest";
import { makeComponentConfig, renderWithProvider } from "../../test";
import { Spinner } from "./spinner";

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
