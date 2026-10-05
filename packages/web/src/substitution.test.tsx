/**
 * The shared substitution contract (`DES-036`, `DES-110`).
 *
 * The framework decides the substitution API once and applies it identically to
 * the three primitives, so a consumer learns one pair of props and uses it on
 * `Link`, `Image` and `Form`. This file proves that by substituting the same
 * component into all three and checking that each one forwards `componentProps`
 * to it.
 */

import { describe, expect, it } from "vitest";
import { Form } from "./components/form";
import { Image } from "./components/image";
import { Link } from "./components/link";
import { renderToServerString } from "./test";

/** Props the substituted component receives, in call order. */
const received: Array<Record<string, unknown>> = [];

/** A stand-in for a framework component. */
function Substituted(props: { "data-substituted"?: string }) {
  received.push(props as Record<string, unknown>);
  return null;
}

describe("substitution API", () => {
  it("forwards componentProps to component on Link, Image and Form", () => {
    received.length = 0;

    renderToServerString(
      <Link
        href="/x"
        component={Substituted}
        componentProps={{ "data-substituted": "link" }}>
        x
      </Link>,
    );
    renderToServerString(
      <Image
        src="/x.png"
        alt="x"
        component={Substituted}
        componentProps={{ "data-substituted": "image" }}
      />,
    );
    renderToServerString(
      <Form
        component={Substituted}
        componentProps={{ "data-substituted": "form" }}
      />,
    );

    expect(received.map((props) => props["data-substituted"])).toEqual([
      "link",
      "image",
      "form",
    ]);
  });

  it("lets componentProps override the props the framework passes itself", () => {
    received.length = 0;

    renderToServerString(
      <Link
        href="/framework"
        component={Substituted}
        componentProps={{ href: "/consumer" }}>
        x
      </Link>,
    );

    expect(received[0]?.href).toBe("/consumer");
  });
});
