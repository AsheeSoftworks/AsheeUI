/**
 * Behaviour tests for the native class merge.
 *
 * The tests state the contract the renderers' composition depends on: a consumer's class
 * replaces the framework's *for the same property*, a class for a different property is
 * kept, a state's class does not cancel the resting one, and a class the merge does not
 * model is never lost. The last one is what makes an incomplete table safe.
 */

import { classNames } from "./class-names";
import { cn } from "./cn";

describe("cn", () => {
  it("keeps the last class that states a property", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("bg-primary", "bg-danger")).toBe("bg-danger");
  });

  it("keeps classes for different properties, in the order they were written", () => {
    expect(cn("flex-row", "items-center", "gap-2")).toBe(
      "flex-row items-center gap-2",
    );
  });

  it("keeps the survivor where the later class was written", () => {
    // Dropping the earlier class and leaving the survivor in place is what makes the
    // precedence readable: the consumer's class is the one that appears last.
    expect(cn("p-2 m-4 p-6")).toBe("m-4 p-6");
  });

  it("drops the empty values a conditional produces", () => {
    const compact = false;

    expect(cn("p-2", compact && "p-1", undefined, null, "", "gap-1")).toBe(
      "p-2 gap-1",
    );
  });

  it("keeps a property's families apart, because they are different declarations", () => {
    // A size is not a colour, a width is not a colour, and a gradient is not a colour.
    expect(cn("text-sm", "text-primary")).toBe("text-sm text-primary");
    expect(cn("border", "border-border")).toBe("border border-border");
    expect(cn("bg-linear-to-r", "bg-primary")).toBe(
      "bg-linear-to-r bg-primary",
    );
    expect(cn("p-2", "px-4")).toBe("p-2 px-4");
    expect(cn("rounded-md", "rounded-t-none")).toBe(
      "rounded-md rounded-t-none",
    );
  });

  it("keeps a state's class beside the resting one", () => {
    // The variant is part of what a class declares, so pressing cannot cancel resting.
    expect(cn("opacity-100", "active:opacity-90")).toBe(
      "opacity-100 active:opacity-90",
    );
    expect(cn("active:opacity-90", "active:opacity-50")).toBe(
      "active:opacity-50",
    );
  });

  it("reads an arbitrary value's own colons as part of the value", () => {
    expect(cn("bg-[url(data:image/png;base64,AA)]", "p-2")).toBe(
      "bg-[url(data:image/png;base64,AA)] p-2",
    );
  });

  it("keeps a class it does not model rather than dropping it", () => {
    // The table names what the framework's dictionaries use. A class outside it is kept,
    // which is the previous join's behaviour: an incomplete table costs bytes, not styles.
    expect(cn("some-custom-utility", "another-one", "p-2")).toBe(
      "some-custom-utility another-one p-2",
    );
  });

  it("is the same function the package published as classNames", () => {
    expect(classNames).toBe(cn);
  });
});
