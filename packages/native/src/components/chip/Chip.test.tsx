/**
 * Behaviour tests for the native Chip.
 *
 * The tests state the component's contract: the label is the chip's own reading, the
 * status dot, avatar and icons fill the slots around it, the remove control is a control
 * with its own name that fires the close callback and disappears when the chip is not
 * closable, a disabled chip dims and refuses to close, the token is a button only when the
 * consumer made it pressable, and the density, rounding and colour resolve through the
 * configuration cascade.
 */

import {
  fireEvent,
  type ReactTestInstance,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Chip } from "./Chip";

/**
 * Render a chip inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderChip(ui: ReactElement, config?: object) {
  return render(<AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>);
}

/**
 * Every descendant of a node that carries a prop.
 * The chip's parts have no test identifiers — they are not public — so a test reaches them
 * from the chip it rendered.
 *
 * @param node - The node to search below.
 * @param prop - The prop a descendant must carry.
 * @returns The descendants carrying it.
 */
function descendantsWithProp(
  node: ReactTestInstance,
  prop: string,
): ReactTestInstance[] {
  const found: ReactTestInstance[] = [];

  const walk = (current: ReactTestInstance) => {
    if ((current.props as Record<string, unknown>)[prop] !== undefined) {
      found.push(current);
    }

    for (const child of current.children) {
      if (typeof child !== "string") walk(child);
    }
  };

  walk(node);

  return found;
}

describe("Native Chip", () => {
  it("reads its label as the chip's own name", async () => {
    const view = await renderChip(<Chip testID="chip">React</Chip>);

    expect(view.getByText("React")).toBeTruthy();
  });

  it("fills the leading slot with a status dot", async () => {
    const view = await renderChip(
      <Chip testID="chip" color="success" dot>
        Online
      </Chip>,
    );
    const chip = view.getByTestId("chip");

    expect(
      descendantsWithProp(chip, "className").some((node) =>
        String(node.props.className).includes("h-1.5 w-1.5"),
      ),
    ).toBe(true);
  });

  it("gives the remove control its own name and fires it", async () => {
    const onClose = jest.fn();
    const view = await renderChip(
      <Chip testID="chip" onClose={onClose} closeLabel="Remove React">
        React
      </Chip>,
    );

    fireEvent.press(view.getByLabelText("Remove React"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("names the remove control when the consumer does not", async () => {
    const view = await renderChip(<Chip testID="chip" onClose={() => {}}>React</Chip>);

    // A closer that says nothing about what it closes is worse than no name at all, so the
    // component states a default rather than leaving the control anonymous.
    expect(view.getByLabelText("Remove chip")).toBeTruthy();
  });

  it("puts the trailing icon away when the chip is closable", async () => {
    const view = await renderChip(
      <Chip testID="chip" endIcon={<Text>Chevron</Text>} onClose={() => {}}>
        React
      </Chip>,
    );

    expect(view.queryByText("Chevron")).toBeNull();
  });

  it("dims a disabled chip and refuses to close it", async () => {
    const onClose = jest.fn();
    const view = await renderChip(
      <Chip testID="chip" isDisabled onClose={onClose} closeLabel="Remove React">
        React
      </Chip>,
    );
    const chip = view.getByTestId("chip");

    expect(String(chip.props.className)).toContain("opacity-50");

    fireEvent.press(view.getByLabelText("Remove React"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("is a button that fires its callback when the consumer made it pressable", async () => {
    const onPress = jest.fn();
    const view = await renderChip(
      <Chip testID="chip" onPress={onPress}>
        Filter
      </Chip>,
    );
    const chip = view.getByTestId("chip");

    expect(chip.props.accessibilityRole).toBe("button");

    fireEvent.press(chip);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is a plain token rather than a button when nothing can be pressed", async () => {
    const view = await renderChip(<Chip testID="chip">Label</Chip>);

    expect(view.getByTestId("chip").props.accessibilityRole).toBeUndefined();
  });

  it("resolves its density, rounding and colour through the cascade", async () => {
    // The platform's default treatment is solid, so the colour shows in the surface rather
    // than in a border; the assertion keeps to what the pair of options produces.
    const view = await renderChip(<Chip testID="chip">React</Chip>, {
      components: { chip: { size: "lg", radius: "md", color: "danger" } },
    });
    const chip = view.getByTestId("chip");

    expect(String(chip.props.className)).toContain("rounded-md");
    expect(String(chip.props.className)).toContain("px-3 py-1.5");
    expect(String(chip.props.className)).toContain("bg-danger");
    expect(String(view.getByText("React").props.className)).toContain(
      "text-base",
    );
  });

  it("takes the outlined treatment and its accent from the configuration", async () => {
    const view = await renderChip(<Chip testID="chip">React</Chip>, {
      components: { chip: { variant: "bordered", color: "danger" } },
    });
    const chip = view.getByTestId("chip");

    expect(String(chip.props.className)).toContain("border-danger");
    expect(String(view.getByText("React").props.className)).toContain(
      "text-danger",
    );
  });
});
