/**
 * Behaviour tests for the PinInput field.
 *
 * The checks cover the behaviour the component owns: typing, keyboard
 * navigation, deletion, paste distribution, completion reporting, the
 * controlled and uncontrolled forms, and the field contract's accessibility
 * wiring.
 */

import { useState } from "react";
import { describe, expect, it } from "vitest";
import {
  expectDescribedBy,
  expectHydrationClean,
  fireEvent,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
  userEvent,
} from "../../test";
import { PinInput, sanitizePinValue } from "./PinInput";

/** The boxes of a rendered PIN field, in order. */
function boxes(container: HTMLElement): HTMLInputElement[] {
  return Array.from(container.querySelectorAll("input[type='text']"));
}

describe("sanitizePinValue", () => {
  it("keeps only the characters the mode accepts", () => {
    expect(sanitizePinValue("12a3", "numeric")).toBe("123");
    expect(sanitizePinValue("12a3-", "alphanumeric")).toBe("12a3");
    expect(sanitizePinValue("ab c", "text")).toBe("abc");
  });
});

describe("PinInput", () => {
  it("renders one named group with one box per character", () => {
    const { container, getByRole } = renderWithProvider(
      <PinInput length={6} />,
    );

    expect(getByRole("group", { name: "Verification code" })).toBeDefined();
    expect(boxes(container)).toHaveLength(6);
  });

  it("wires the field contract to the group", () => {
    const { container, getByRole, getByText } = renderWithProvider(
      <PinInput
        label="Verification code"
        description="The six digits we sent."
        message="That code has expired."
        status="error"
        required
      />,
    );
    const group = getByRole("group", { name: "Verification code" });

    expectDescribedBy(group, getByText("The six digits we sent."));
    expect(group.getAttribute("aria-describedby")).toContain("-message");
    expect(getByText("That code has expired.")).toBeDefined();
    expect(container.querySelector("label")?.textContent).toContain("*");
  });

  it("types a numeric code, moves focus and reports completion once", async () => {
    const user = userEvent.setup();
    const values: string[] = [];
    const completions: string[] = [];
    const { container } = renderWithProvider(
      <PinInput
        length={4}
        onValueChange={(value) => values.push(value)}
        onComplete={(value) => completions.push(value)}
      />,
    );

    await user.type(boxes(container)[0], "1234");

    expect(values).toEqual(["1", "12", "123", "1234"]);
    expect(completions).toEqual(["1234"]);
    expect(document.activeElement).toBe(boxes(container)[3]);
  });

  it("ignores characters the mode does not accept", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProvider(<PinInput mode="numeric" />);

    await user.type(boxes(container)[0], "1a2");

    expect(boxes(container)[0].value).toBe("1");
    expect(boxes(container)[1].value).toBe("2");
  });

  it("deletes backwards and packs the remaining characters together", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProvider(<PinInput defaultValue="1234" />);

    boxes(container)[3].focus();
    await user.keyboard("{Backspace}");
    expect(boxes(container).map((box) => box.value)).toEqual([
      "1",
      "2",
      "3",
      "",
    ]);

    boxes(container)[0].focus();
    await user.keyboard("{Backspace}");
    expect(boxes(container).map((box) => box.value)).toEqual([
      "2",
      "3",
      "",
      "",
    ]);
  });
});

describe("PinInput interaction and configuration", () => {
  it("fills the boxes from the start when the whole code is pasted", () => {
    const { container } = renderWithProvider(<PinInput length={6} />);
    const input = boxes(container)[2];

    fireEvent.paste(input, {
      clipboardData: { getData: () => "9876" },
    });

    expect(boxes(container).map((box) => box.value)).toEqual([
      "9",
      "8",
      "7",
      "6",
      "",
      "",
    ]);
  });

  it("replaces from the caret when the pasted code lands among characters", () => {
    const { container } = renderWithProvider(
      <PinInput length={4} defaultValue="12" />,
    );
    const input = boxes(container)[1];

    fireEvent.paste(input, {
      clipboardData: { getData: () => "987" },
    });

    expect(boxes(container).map((box) => box.value)).toEqual([
      "1",
      "9",
      "8",
      "7",
    ]);
  });

  it("distributes a code that arrives in one box, as an autofill does", () => {
    const { container } = renderWithProvider(<PinInput length={4} />);
    const input = boxes(container)[0];

    fireEvent.change(input, { target: { value: "1234" } });

    expect(boxes(container).map((box) => box.value)).toEqual([
      "1",
      "2",
      "3",
      "4",
    ]);
  });

  it("moves between the boxes with the arrow keys and the ends", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProvider(<PinInput length={4} />);
    const input = boxes(container);

    input[1].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(input[2]);

    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(input[1]);

    await user.keyboard("{End}");
    expect(document.activeElement).toBe(input[3]);

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(input[0]);
  });

  it("takes a controlled value and reports the change without owning it", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState("");
      return <PinInput value={value} onValueChange={setValue} length={4} />;
    }

    const { container } = renderWithProvider(<Controlled />);
    await user.type(boxes(container)[0], "12");

    expect(boxes(container).map((box) => box.value)).toEqual([
      "1",
      "2",
      "",
      "",
    ]);
  });

  it("marks an invalid value on the boxes and the group", () => {
    const { container, getByRole } = renderWithProvider(
      <PinInput isInvalid label="Code" />,
    );

    expect(getByRole("group", { name: "Code" })).toBeDefined();
    expect(container.innerHTML).toContain("border-danger");
    for (const box of boxes(container)) {
      expect(box.getAttribute("aria-invalid")).toBe("true");
    }
  });

  it("disables every box and reports the group as disabled", () => {
    const { container, getByRole } = renderWithProvider(
      <PinInput isDisabled label="Code" />,
    );

    expect(
      getByRole("group", { name: "Code" }).getAttribute("data-disabled"),
    ).toBe("true");
    for (const box of boxes(container)) {
      expect(box.disabled).toBe(true);
    }
    expect(container.innerHTML).toContain("bg-secondary/40");
  });

  it("masks the characters when it is asked to", () => {
    const { container } = renderWithProvider(<PinInput masked length={4} />);

    expect(container.querySelectorAll("input[type='password']")).toHaveLength(
      4,
    );
  });

  it("submits the code through a named hidden field", () => {
    const { container } = renderWithProvider(
      <PinInput name="code" defaultValue="1234" />,
    );
    const hidden = container.querySelector(
      "input[type='hidden']",
    ) as HTMLInputElement;

    expect(hidden.name).toBe("code");
    expect(hidden.value).toBe("1234");
  });

  it("groups the boxes visually when a separator is asked for", () => {
    const { container } = renderWithProvider(
      <PinInput length={6} separatorAfter={3} />,
    );

    expect(container.textContent).toContain("-");
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<PinInput />, {
      config: makeComponentConfig("pininput", { length: 6, size: "lg" }),
    });

    expect(boxes(container)).toHaveLength(6);
    expect(boxes(container)[0].className).toContain("h-14");
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(<PinInput length={4} label="Code" />);

    expect(html).toContain("<fieldset");
    expect(html).toContain("character 1 of 4");
    expectHydrationClean(<PinInput length={4} label="Code" />);
  });
});
