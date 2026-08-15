import {
  Accordion,
  Autocomplete,
  type AutocompleteOption,
  Button,
  Card,
  Carousel,
  Chip,
  Image,
  Link,
  Modal,
  MultiSelect,
  type MultiSelectOption,
  Text,
} from "@ashee/ui";
import type {
  ModalAnimationPreset,
  ModalPosition,
  ModalSizeKey,
} from "@ashee/ui/src/components/complex/modal/modal-config.js";
import type {
  FieldSizeKey,
  FieldStatus,
} from "@ashee/ui/src/components/primitive/field/field-config.js";
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
  const [isOpen, setIsOpen] = useState(false);

  // Configurable Parameters for Live Testing
  const [position, setPosition] = useState<ModalPosition>("center");
  const [size, setSize] = useState<ModalSizeKey>("md");
  const [animation, setAnimation] = useState<ModalAnimationPreset>("scale");
  const [closeOnBackdropClick, setCloseOnBackdropClick] = useState(true);
  const [closeOnEscape, setCloseOnEscape] = useState(true);

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

  // Helper to open modal with quick preset parameters
  const handleOpenPreset = (
    pos: ModalPosition,
    anim: ModalAnimationPreset,
    sz: ModalSizeKey = "md",
  ) => {
    setPosition(pos);
    setAnimation(anim);
    setSize(sz);
    setIsOpen(true);
  };
  return (
    <main className="max-w-4xl mx-auto p-8 space-y-12">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold">
          Playground: Local Props Overrides
        </h1>
        <p className="text-muted-foreground">
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

      {/* Card */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Card (Local Props)</h2>
        <Card
          variant="elevated"
          size="lg"
          radius="xl"
          shadow="lg"
          isClickable
          title="Customized Card Title"
          description="Overridden with local prop settings and shorthand image"
          imageSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
          imageAlt="Abstract thumbnail"
          imagePosition="top"
          imageRatio="video"
          imageFit="cover">
          <p className="text-sm">
            Card body passed directly as standard children.
          </p>
        </Card>
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
          shadow="md"
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
          variant="cards"
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

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Triggers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleOpenPreset("center", "scale", "md")}
            className="px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted font-medium text-sm transition-colors cursor-pointer text-left">
            <span className="block font-semibold">Center Scale</span>
            <span className="text-xs text-muted-foreground">
              Default pop-in
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPreset("top", "slide-down", "md")}
            className="px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted font-medium text-sm transition-colors cursor-pointer text-left">
            <span className="block font-semibold">Top Slide Down</span>
            <span className="text-xs text-muted-foreground">
              Notice / Alert style
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPreset("bottom", "slide-up", "md")}
            className="px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted font-medium text-sm transition-colors cursor-pointer text-left">
            <span className="block font-semibold">Bottom Sheet Style</span>
            <span className="text-xs text-muted-foreground">
              Slide up from bottom
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPreset("center", "drop", "md")}
            className="px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted font-medium text-sm transition-colors cursor-pointer text-left">
            <span className="block font-semibold">Drop Down</span>
            <span className="text-xs text-muted-foreground">
              Top drop with scale
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPreset("center", "flip", "md")}
            className="px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted font-medium text-sm transition-colors cursor-pointer text-left">
            <span className="block font-semibold">3D Flip</span>
            <span className="text-xs text-muted-foreground">
              Perspective rotateX
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPreset("center", "fade", "md")}
            className="px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted font-medium text-sm transition-colors cursor-pointer text-left">
            <span className="block font-semibold">Pure Fade</span>
            <span className="text-xs text-muted-foreground">Opacity only</span>
          </button>
        </div>
      </section>

      <section className="space-y-4 border border-border rounded-xl p-4 bg-muted/20">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          2. Live Configurations
        </h2>

        {/* Animation Selection */}
        <div className="space-y-1.5">
          <Text as="label">Animation Preset</Text>
          <div className="flex flex-wrap gap-2">
            {(
              [
                "scale",
                "zoom",
                "slide-up",
                "slide-down",
                "fade",
                "drop",
                "flip",
              ] as ModalAnimationPreset[]
            ).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAnimation(a)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  animation === a
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border hover:bg-muted text-foreground"
                }`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Position Selection */}
        <div className="space-y-1.5">
          <Text as="label">Position</Text>
          <div className="flex flex-wrap gap-2">
            {(["center", "top", "bottom"] as ModalPosition[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPosition(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  position === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border hover:bg-muted text-foreground"
                }`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-1.5">
          <Text as="label">Size Token</Text>
          <div className="flex flex-wrap gap-2">
            {(["sm", "md", "lg", "xl", "full"] as ModalSizeKey[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  size === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border hover:bg-muted text-foreground"
                }`}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Behavior Toggles */}
        <div className="flex flex-wrap gap-6 pt-2 border-t border-border/50">
          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={closeOnBackdropClick}
              onChange={(e) => setCloseOnBackdropClick(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            Close on Backdrop Click
          </label>

          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={closeOnEscape}
              onChange={(e) => setCloseOnEscape(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            Close on ESC Key
          </label>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full mt-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer">
          Open Modal with Current Config
        </button>
      </section>

      {/* ── 3. Active State Readout ───────────────────────────── */}
      <section className="p-3 bg-muted rounded-lg text-xs font-mono text-muted-foreground flex flex-wrap gap-4 items-center justify-between">
        <span>
          Modal Open: <strong>{String(isOpen)}</strong>
        </span>
        <span>
          Animation: <strong>{animation}</strong>
        </span>
        <span>
          Position: <strong>{position}</strong>
        </span>
        <span>
          Size: <strong>{size}</strong>
        </span>
      </section>

      {/* ── Modal Component Instance ────────────────────────── */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        animation={animation}
        position={position}
        size={size}
        closeOnBackdropClick={closeOnBackdropClick}
        closeOnEscape={closeOnEscape}>
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Edit Profile Settings
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Animation: <span className="font-mono">{animation}</span> |
                Position: <span className="font-mono">{position}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close modal"
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 text-sm text-foreground/80">
            <div className="space-y-1.5">
              <Text as={"label"}>Display Name</Text>
              <input
                type="text"
                defaultValue="Ashee Softworks"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Text as={"label"}>Framework Workspace</Text>
              <input
                type="text"
                defaultValue="@ashee/ui"
                className="w-full px-3 py-2  rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
              />
            </div>

            <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-1">
              <p className="font-semibold text-foreground">Test Checklist:</p>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                <li>
                  Press{" "}
                  <kbd className="px-1 py-0.5 border rounded bg-background">
                    ESC
                  </kbd>{" "}
                  to dismiss
                </li>
                <li>Click backdrop overlay to dismiss</li>
                <li>
                  Verify smooth enter/exit easing with cubic-bezier transition
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-md border border-border text-xs font-medium hover:bg-muted transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      <section className="max-w-4xl mx-auto p-6 space-y-10">
        {/* ── Page Header ──────────────────────────────────────────────────────── */}
        <header className="border-b border-border pb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            MultiSelect Test Harness
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
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
            <p className="text-xs text-muted-foreground">
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
            <p className="text-xs text-muted-foreground">
              Test size scaling, field status borders, and toggle flags live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 border border-border rounded-xl bg-muted/10">
            {/* Controls Column */}
            <div className="space-y-4 md:col-span-1 border-r border-border/60 pr-4">
              {/* Status Selection */}
              <div className="space-y-1.5">
                <Text as="label">Field Status</Text>
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
                          : "bg-background border-border text-foreground hover:bg-muted"
                      }`}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Tokens */}
              <div className="space-y-1.5">
                <Text as="label">Size Token</Text>
                <div className="flex gap-1.5">
                  {(["sm", "md", "lg"] as FieldSizeKey[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFSize(sz)}
                      className={`px-3 py-1 text-xs rounded-md border uppercase font-medium cursor-pointer transition-colors ${
                        size === sz
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-foreground hover:bg-muted"
                      }`}>
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
                description={`Size: ${size} | Status: ${status}`}
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
            <p className="text-xs text-muted-foreground">
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

      <section className="space-y-3 p-5 border rounded-xl bg-card">
        <h2 className="text-base font-semibold">
          1. Standard Controlled Selection
        </h2>
        <p className="text-xs text-muted-foreground">
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

        <div className="p-3 bg-muted rounded-md text-xs space-y-1 font-mono">
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
      <section className="space-y-3 p-5 border rounded-xl bg-card">
        <h2 className="text-base font-semibold">2. Allow Custom Values</h2>
        <p className="text-xs text-muted-foreground">
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

        <div className="p-3 bg-muted rounded-md text-xs font-mono">
          Current Value:{" "}
          <span className="font-bold">{String(customValue)}</span>
        </div>
      </section>

      {/* ─── TEST CASE 3: Styled Overrides & Footer Slot ────────────────── */}
      <section className="space-y-3 p-5 border rounded-xl bg-card">
        <h2 className="text-base font-semibold">
          3. Popover Styling & Footer Slot
        </h2>
        <p className="text-xs text-muted-foreground">
          Demonstrates custom menu colors, sizes, and inserting a custom element
          into `belowList`.
        </p>

        <Autocomplete
          options={FRUIT_OPTIONS}
          placeholder="Custom styled menu..."
          menuVariant="bordered"
          menuSize="md"
          belowList={
            <div className="p-2 border-t text-center text-xs text-muted-foreground">
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
