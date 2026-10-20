/**
 * Pins the rule for `defaultRadius` (F-128).
 *
 * A component that registers `radius` has already answered tier 2 for every
 * instance, so the application's `defaultRadius` never reaches it. A component
 * that leaves `radius` unregistered follows the application, and its hard
 * fallback only answers when no tier does. The split is deliberate: components
 * whose rounding is part of their shape pin it, while a surface that merely
 * takes a finish follows the application.
 *
 * These tests fail if a pinned component starts following the global key, or if
 * an unregistered component stops.
 */

import { describe, expect, it } from "vitest";
import { Avatar } from "../components/data-display/avatar/Avatar";
import { Badge } from "../components/data-display/badge/Badge";
import { Image } from "../components/data-display/image/Image";
import { Alert } from "../components/feedback/alert/Alert";
import { renderWithProvider } from "./render";

describe("defaultRadius and registered radius", () => {
  it("keeps an alert pinned to its registered radius", () => {
    const { container } = renderWithProvider(<Alert id="alert">Body</Alert>, {
      config: { defaultRadius: "none" },
    });

    expect(container.querySelector("#alert")).toHaveClass("rounded-md");
    expect(container.querySelector("#alert")).not.toHaveClass("rounded-none");
  });

  it("keeps a pill badge and a circular avatar round when the application is square", () => {
    const { container } = renderWithProvider(
      <>
        <Badge id="badge">Active</Badge>
        <Avatar id="avatar" name="Ada Lovelace" />
      </>,
      { config: { defaultRadius: "none" } },
    );

    expect(container.querySelector("#badge")).toHaveClass("rounded-full");
    expect(container.querySelector("#avatar")).toHaveClass("rounded-full");
  });

  it("lets an image follow the application, because it registers no radius", () => {
    const { container } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" />,
      { config: { defaultRadius: "lg" } },
    );

    expect(container.firstElementChild).toHaveClass("rounded-lg");
  });

  it("lets a pinned radius be restated through the component's section", () => {
    const { container } = renderWithProvider(<Badge id="badge">Active</Badge>, {
      config: { components: { badge: { radius: "sm" } } },
    });

    expect(container.querySelector("#badge")).toHaveClass("rounded-sm");
  });
});
