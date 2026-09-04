"use client";

import { Button, Tooltip, useTheme } from "asheeui";

export default function TooltipTestPage() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  return (
    <div className="p-12 max-w-5xl mx-auto space-y-12 bg-background text-foreground min-h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-2">Tooltip Component Test Page</h1>
        <p className="text-foreground/70 text-sm">
          Hover or focus over the buttons below to verify placement, animations,
          arrows, colors, and variants.
        </p>
      </div>

      {/* 1. Placements Test */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">
          1. Placements
        </h2>
        <div className="flex flex-wrap gap-4 items-center justify-center py-8 bg-secondary/20 rounded-lg">
          <Tooltip content="Tooltip on Top" placement="top" showArrow>
            <Button className="px-4 py-2 text-sm bg-secondary rounded-md font-medium">
              Top
            </Button>
          </Tooltip>

          <Tooltip content="Tooltip on Bottom" placement="bottom" showArrow>
            <Button className="px-4 py-2 text-sm bg-secondary rounded-md font-medium">
              Bottom
            </Button>
          </Tooltip>

          <Tooltip content="Tooltip on Left" placement="left" showArrow>
            <Button className="px-4 py-2 text-sm bg-secondary rounded-md font-medium">
              Left
            </Button>
          </Tooltip>

          <Tooltip content="Tooltip on Right" placement="right" showArrow>
            <Button className="px-4 py-2 text-sm bg-secondary rounded-md font-medium">
              Right
            </Button>
          </Tooltip>
        </div>
      </section>

      {/* 2. Sizes Test */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">
          2. Sizes
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Tooltip content="Small Tooltip Text" size="sm">
            <Button className="px-3 py-1.5 text-xs bg-secondary rounded">
              Small (sm)
            </Button>
          </Tooltip>

          <Tooltip content="Medium Tooltip Text" size="md">
            <Button className="px-4 py-2 text-sm bg-secondary rounded">
              Medium (md)
            </Button>
          </Tooltip>

          <Tooltip content="Large Tooltip Text" size="lg">
            <Button className="px-5 py-2.5 text-base bg-secondary rounded">
              Large (lg)
            </Button>
          </Tooltip>
        </div>
      </section>

      {/* 3. Colors & Variants Test */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">
          3. Colors & Variants
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <Tooltip
            content="Primary Solid"
            color="primary"
            variant="solid"
            showArrow>
            <Button className="px-3 py-2 text-xs bg-primary text-secondary rounded">
              Primary
            </Button>
          </Tooltip>

          <Tooltip
            content="Secondary Faded"
            color="secondary"
            variant="faded"
            showArrow>
            <Button className="px-3 py-2 text-xs bg-secondary text-foreground rounded">
              Secondary
            </Button>
          </Tooltip>

          <Tooltip
            content="Danger Bordered"
            color="danger"
            variant="bordered"
            showArrow>
            <Button className="px-3 py-2 text-xs border border-danger text-danger rounded">
              Danger
            </Button>
          </Tooltip>

          <Tooltip
            content="Success Solid"
            color="success"
            variant="solid"
            showArrow>
            <Button className="px-3 py-2 text-xs bg-success text-secondary rounded">
              Success
            </Button>
          </Tooltip>

          <Tooltip
            content="Warning Ghost"
            color="warning"
            variant="ghost"
            showArrow>
            <Button className="px-3 py-2 text-xs text-warning rounded">
              Warning
            </Button>
          </Tooltip>
        </div>
      </section>

      {/* 4. Special Features */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">
          4. Features & States
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Tooltip content="Instant opening!" delay={0}>
            <Button className="px-4 py-2 text-sm bg-secondary rounded">
              Zero Delay
            </Button>
          </Tooltip>

          <Tooltip content="Custom Rich Content 🔥" showArrow color="primary">
            <Button className="px-4 py-2 text-sm bg-secondary rounded">
              Rich Content
            </Button>
          </Tooltip>

          <Tooltip content="You shouldn't see this" isDisabled>
            <Button className="px-4 py-2 text-sm bg-secondary/40 text-foreground/70 rounded cursor-not-allowed">
              Disabled Tooltip
            </Button>
          </Tooltip>
        </div>
      </section>

      <section>
        <Button onClick={() => toggleTheme()}>
          Current: {theme} (Active: {resolvedTheme})
        </Button>
      </section>
    </div>
  );
}
