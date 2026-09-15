/**
 * Behaviour tests for the AuthLayout page shell.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { AuthLayout } from "./AuthLayout";

describe("AuthLayout", () => {
  it("renders the brand, the heading and the form", () => {
    const { getByRole, getByText } = renderWithProvider(
      <AuthLayout
        brand="Ashee SMS"
        title="Sign in"
        description="Use your email.">
        <form aria-label="Sign in form" />
      </AuthLayout>,
    );

    expect(getByText("Ashee SMS")).toBeDefined();
    expect(getByRole("heading", { name: "Sign in" })).toBeDefined();
    expect(getByRole("form", { name: "Sign in form" })).toBeDefined();
  });

  it("panelises the form by default and can be told not to", () => {
    const { container: panel } = renderWithProvider(
      <AuthLayout>form</AuthLayout>,
    );
    expect(panel.querySelector(".border-border")).not.toBeNull();

    const { container: plain } = renderWithProvider(
      <AuthLayout panel={false}>form</AuthLayout>,
    );

    expect(plain.querySelector(".border-border")).toBeNull();
  });

  it("renders the footer slot under the form", () => {
    const { getByText } = renderWithProvider(
      <AuthLayout footer={<span>Forgot your password?</span>}>form</AuthLayout>,
    );

    expect(getByText("Forgot your password?")).toBeDefined();
  });

  it("adds a media column only when there is media, on the side it is asked for", () => {
    const { container: single } = renderWithProvider(
      <AuthLayout>form</AuthLayout>,
    );
    expect(single.querySelector(".min-h-48")).toBeNull();

    const { container: split } = renderWithProvider(
      <AuthLayout media={<span>Shot</span>} mediaPosition="start">
        form
      </AuthLayout>,
    );

    expect(split.querySelector(".min-h-48")).not.toBeNull();
    expect(split.querySelector(".lg\\:order-first")).not.toBeNull();
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<AuthLayout>form</AuthLayout>, {
      config: makeComponentConfig("authlayout", {
        panel: false,
        contentSize: "md",
      }),
    });

    expect(container.querySelector(".max-w-lg")).not.toBeNull();
    expect(container.querySelector(".border-border")).toBeNull();
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <AuthLayout title="Sign in">form</AuthLayout>,
    );

    expect(html).toContain("Sign in");
    expect(html).toContain("min-h-dvh");
    expectHydrationClean(<AuthLayout title="Sign in">form</AuthLayout>);
  });
});
