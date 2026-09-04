import {
  Accordion,
  Autocomplete,
  type AutocompleteOption,
  Button,
  Carousel,
  Chip,
  type FieldSizeKey,
  type FieldStatus,
  Image,
  Link,
  MultiSelect,
  type MultiSelectOption,
} from "asheeui";
import { useState } from "react";

export default function LocalPropsTestPage() {
  const FRAMEWORK_OPTIONS: MultiSelectOption[] = [
    { label: "Next.js", value: "nextjs" },
    { label: "React", value: "react" },
    { label: "TypeScript", value: "typescript" },
    { label: "Tailwind CSS", value: "tailwindcss" },
    { label: "Framer Motion", value: "framer-motion" },
    { label: "Zustand", value: "zustand" },
    { label: "Bun", value: "bun" },
    { label: "Hono", value: "hono", disabled: true }, // Disabled option test
    { label: "SQLite", value: "sqlite" },
    { label: "PostgreSQL", value: "postgresql" },
  ];

  const FRUIT_OPTIONS: AutocompleteOption[] = [
    { label: "Apple 🍎", value: "apple" },
    { label: "Banana 🍌", value: "banana" },
    { label: "Blueberry 🫐", value: "blueberry" },
    { label: "Cherry 🍒", value: "cherry" },
    { label: "Dragonfruit 🐉", value: "dragonfruit" },
    { label: "Elderberry 🍇", value: "elderberry" },
    { label: "Fig 🪵", value: "fig" },
    { label: "Grape 🍇", value: "grape" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Orange 🍊", value: "orange" },
  ];
  const [selectedFruit, setSelectedFruit] = useState<string | number>("cherry");
  const [typedInput, setTypedInput] = useState<string>("");

  // Demo 2: Custom Value State
  const [customValue, setCustomValue] = useState<string | number>("");

  const [selectedFrameworks, setSelectedFrameworks] = useState<
    (string | number)[]
  >(["nextjs", "typescript"]);

  // ── State 2: Configurable Field Demo ──────────────────────────────────────
  const [demoValues, setDemoValues] = useState<(string | number)[]>([]);
  const [status, setStatus] = useState<FieldStatus>("default");
  const [fsize, setFSize] = useState<FieldSizeKey>("md");
  const [isSearch, setIsSearch] = useState(true);
  const [disableChipDisplay, setDisableChipDisplay] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── State 3: Custom Chip Handlers Test ────────────────────────────────────
  const [customChips, setCustomChips] = useState<MultiSelectOption[]>([
    { label: "Framer Motion", value: "framer-motion" },
  ]);

  const handleAddChip = (item: MultiSelectOption) => {
    setCustomChips((prev) => [...prev, item]);
  };

  const handleRemoveChip = (id: string | number) => {
    setCustomChips((prev) => prev.filter((chip) => chip.value !== id));
  };

  // ── Helper Actions ────────────────────────────────────────────────────────
  const handleSelectAll = () => {
    const allSelectable = FRAMEWORK_OPTIONS.filter((opt) => !opt.disabled).map(
      (opt) => opt.value,
    );
    setSelectedFrameworks(allSelectable);
  };

  const handleClearAll = () => {
    setSelectedFrameworks([]);
  };

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-12">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold">
          Playground: Local Props Overrides
        </h1>
        <p className="text-foreground/70">
          Testing components using explicit props to override configuration.
        </p>
      </header>

      {/* Chip */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Chip (Local Props)</h2>
        <div className="flex gap-3">
          <Chip variant="solid" color="danger" size="lg" radius="full">
            Critical Alert
          </Chip>
          <Chip variant="bordered" color="primary" size="sm" radius="md">
            Back Step
          </Chip>
        </div>
      </section>

      {/* Link */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Link (Local Props)</h2>
        <div className="flex flex-col gap-2">
          <Link href="https://github.com" size="lg" isExternal>
            External Danger Link
          </Link>
        </div>
      </section>

      {/* Image */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Image (Local Props)</h2>
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
          alt="Abstract render"
          fit="cover"
          ratio="portrait"
          radius="lg"
          showSkeleton
        />
      </section>

      {/* Accordion */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Accordion (Local Props)</h2>
        <Accordion
          variant="bordered"
          size="lg"
          radius="lg"
          allowMultiple
          defaultValue={["panel-1"]}
          items={[
            {
              id: "panel-1",
              title: "Explicit Multiple Item 1",
              subtitle: "First section description",
              content: "Multiple panels can remain open concurrently.",
            },
            {
              id: "panel-2",
              title: "Explicit Multiple Item 2",
              subtitle: "Second section description",
              content: "Second panel body text.",
            },
          ]}
        />
      </section>

      {/* Carousel */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Carousel (Local Props)</h2>
        <Carousel
          variant="ghost"
          size="lg"
          radius="xl"
          autoPlay
          autoPlayInterval={4000}
          loop
          showControls
          showIndicators
          pauseOnHover
          items={[
            {
              id: "c-1",
              content: (
                <div className="bg-primary/10 p-12 text-center rounded-xl font-bold">
                  Custom Slide 1
                </div>
              ),
            },
            {
              id: "c-2",
              content: (
                <div className="bg-primary/20 p-12 text-center rounded-xl font-bold">
                  Custom Slide 2
                </div>
              ),
            },
          ]}
        />
      </section>

      <section className="max-w-4xl mx-auto p-6 space-y-10">
        {/* ── Page Header ──────────────────────────────────────────────────────── */}
        <header className="border-b border-border pb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            MultiSelect Test Harness
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            Interactive showcase for Ashee UI MultiSelect component features,
            tokens, and states
          </p>
        </header>

        {/* ── 1. Basic Controlled Instance ─────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              1. Standard Controlled MultiSelect
            </h2>
            <p className="text-xs text-foreground/70">
              Basic selection with search, field metadata, and custom dropdown
              footer (`belowList`).
            </p>
          </div>

          <div className="p-5 border border-border rounded-xl bg-background space-y-4">
            <MultiSelect
              label="Tech Stack Selection"
              description="Choose the primary frameworks for your new project"
              message={
                selectedFrameworks.length === 0
                  ? "Please select at least one framework"
                  : `${selectedFrameworks.length} item(s) selected`
              }
              InputLabel="Select Frameworks..."
              options={FRAMEWORK_OPTIONS}
              value={selectedFrameworks}
              onChange={setSelectedFrameworks}
              chipLabel="Selected Tech Stack"
              belowList={
                <div className="flex items-center justify-between p-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    className="text-xs h-7 px-2">
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-xs h-7 px-2 text-danger hover:bg-danger/10">
                    Clear All
                  </Button>
                </div>
              }
            />
          </div>
        </section>

        {/* ── 2. Live Configuration Sandbox ────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              2. Dynamic Configuration Sandbox
            </h2>
            <p className="text-xs text-foreground/70">
              Test size scaling, field status borders, and toggle flags live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 border border-border rounded-xl bg-secondary/10">
            {/* Controls Column */}
            <div className="space-y-4 md:col-span-1 border-r border-border/60 pr-4">
              {/* Status Selection */}
              <div className="space-y-1.5">
                <p>Field Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    ["default", "error", "warning", "success"] as FieldStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`px-2.5 py-1 text-xs rounded-md border capitalize font-medium cursor-pointer transition-colors ${
                        status === st
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-foreground hover:bg-secondary"
                      }`}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Tokens */}
              <div className="space-y-1.5">
                <p>Size Token</p>
                <div className="flex gap-1.5">
                  {(["sm", "md", "lg"] as FieldSizeKey[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFSize(sz)}
                      className={`px-3 py-1 text-xs rounded-md border uppercase font-medium cursor-pointer transition-colors ${"bg-primary text-primary-foreground border-primary"}`}>
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSearch}
                    onChange={(e) => setIsSearch(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  Enable Search Bar
                </label>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={disableChipDisplay}
                    onChange={(e) => setDisableChipDisplay(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  Disable Chip Display
                </label>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDisabled}
                    onChange={(e) => setIsDisabled(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  Disabled State
                </label>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isLoading}
                    onChange={(e) => setIsLoading(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  Loading State
                </label>
              </div>
            </div>

            {/* Live Preview Column */}
            <div className="md:col-span-2 flex flex-col justify-center bg-background p-4 border border-border rounded-lg">
              <MultiSelect
                label="Configured Component Preview"
                description={` Status: ${status}`}
                message={
                  status === "error"
                    ? "Selection contains invalid items"
                    : undefined
                }
                status={status}
                size={fsize}
                isSearch={isSearch}
                disableChipDisplay={disableChipDisplay}
                disabled={isDisabled}
                isLoading={isLoading}
                options={FRAMEWORK_OPTIONS}
                value={demoValues}
                onChange={setDemoValues}
                InputLabel="Choose items..."
                chipLabel="Active Filters"
              />
            </div>
          </div>
        </section>

        {/* ── 3. Custom Chip Options Handler Test ──────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              3. Custom Chip Handlers (`chipOptions`)
            </h2>
            <p className="text-xs text-foreground/70">
              Using explicit `handleAddChip`, `handleRemoveChip`, and
              `chipOptions` callbacks instead of simple value arrays.
            </p>
          </div>

          <div className="p-5 border border-border rounded-xl bg-background">
            <MultiSelect
              label="Manual Chip Control"
              InputLabel="Add framework chips..."
              options={FRAMEWORK_OPTIONS}
              chipOptions={customChips}
              handleAddChip={handleAddChip}
              handleRemoveChip={handleRemoveChip}
              chipLabel="Managed Chip Collection"
            />
          </div>
        </section>
      </section>

      <section className="space-y-3 p-5 border rounded-xl bg-secondary">
        <h2 className="text-base font-semibold">
          1. Standard Controlled Selection
        </h2>
        <p className="text-xs text-foreground/70">
          Filters options dynamically as you type and locks selection to defined
          items.
        </p>

        <Autocomplete
          options={FRUIT_OPTIONS}
          value={selectedFruit}
          onValueChange={(val, option) => {
            setSelectedFruit(val);
            console.log("Selected option:", option);
          }}
          onInputChange={(text) => setTypedInput(text)}
          placeholder="Search for a fruit..."
        />

        <div className="p-3 bg-secondary rounded-md text-xs space-y-1 font-mono">
          <div>
            Selected Value:{" "}
            <span className="font-bold">{String(selectedFruit)}</span>
          </div>
          <div>
            Raw Input Text:{" "}
            <span className="font-bold">{typedInput || "(idle)"}</span>
          </div>
        </div>
      </section>

      {/* ─── TEST CASE 2: Custom Values Allowed ─────────────────────────── */}
      <section className="space-y-3 p-5 border rounded-xl bg-secondary">
        <h2 className="text-base font-semibold">2. Allow Custom Values</h2>
        <p className="text-xs text-foreground/70">
          Allows freeform typing where unlisted items are treated as valid
          selections.
        </p>

        <Autocomplete
          options={FRUIT_OPTIONS}
          value={customValue}
          allowCustomValue
          onValueChange={(val) => setCustomValue(val)}
          placeholder="Pick a fruit or type anything..."
          menuColor="secondary"
        />

        <div className="p-3 bg-secondary rounded-md text-xs font-mono">
          Current Value:{" "}
          <span className="font-bold">{String(customValue)}</span>
        </div>
      </section>

      {/* ─── TEST CASE 3: Styled Overrides & Footer Slot ────────────────── */}
      <section className="space-y-3 p-5 border rounded-xl bg-secondary">
        <h2 className="text-base font-semibold">
          3. Popover Styling & Footer Slot
        </h2>
        <p className="text-xs text-foreground/70">
          Demonstrates custom menu colors, sizes, and inserting a custom element
          into `belowList`.
        </p>

        <Autocomplete
          options={FRUIT_OPTIONS}
          placeholder="Custom styled menu..."
          menuVariant="bordered"
          menuSize="md"
          belowList={
            <div className="p-2 border-t text-center text-xs text-foreground/70">
              💡 Press{" "}
              <kbd className="px-1 py-0.5 border rounded text-[10px]">Esc</kbd>{" "}
              to close menu
            </div>
          }
        />
      </section>
    </main>
  );
}
