"use client";

import {
  Carousel,
  type CarouselItem,
  type CarouselVariant,
  type Radius,
  type Size,
} from "asheeui";
import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const HERO_SLIDES: CarouselItem[] = [
  {
    id: "hero-1",
    content: (
      <div className="relative w-full h-full flex flex-col justify-end p-8 bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-lg overflow-hidden">
        <span className="text-xs uppercase tracking-widest font-semibold text-purple-300 mb-2">
          Featured Release
        </span>
        <h2 className="text-3xl font-bold mb-2">Next-Gen UI Systems</h2>
        <p className="text-slate-300 max-w-md text-sm mb-4">
          Experience fluidity with our dynamic component library built for speed
          and aesthetics.
        </p>
        <div>
          <button
            type="button"
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-md text-xs font-semibold transition-colors">
            Explore Now
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "hero-2",
    content: (
      <div className="relative w-full h-full flex flex-col justify-end p-8 bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-lg overflow-hidden">
        <span className="text-xs uppercase tracking-widest font-semibold text-emerald-300 mb-2">
          New Feature
        </span>
        <h2 className="text-3xl font-bold mb-2">Responsive Token Engines</h2>
        <p className="text-slate-300 max-w-md text-sm mb-4">
          Seamlessly adapt sizes, spacing, and elevation across all viewport
          breakpoints.
        </p>
        <div>
          <button
            type="button"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-md text-xs font-semibold transition-colors">
            Read Specs
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "hero-3",
    content: (
      <div className="relative w-full h-full flex flex-col justify-end p-8 bg-linear-to-r from-amber-900 via-orange-900 to-slate-900 text-white rounded-lg overflow-hidden">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-300 mb-2">
          Optimization
        </span>
        <h2 className="text-3xl font-bold mb-2">Zero-Flicker Animations</h2>
        <p className="text-slate-300 max-w-md text-sm mb-4">
          Hardware accelerated Framer Motion spring physics for real-time
          interaction.
        </p>
        <div>
          <button
            type="button"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-md text-xs font-semibold transition-colors">
            View Benchmarks
          </button>
        </div>
      </div>
    ),
  },
];

const PRODUCT_ITEMS: CarouselItem[] = [
  {
    id: "prod-1",
    content: (
      <div className="p-6 bg-secondary rounded-lg flex items-center justify-between gap-4 w-full">
        <div>
          <span className="text-xs font-medium text-primary">In Stock</span>
          <h3 className="text-lg font-semibold text-foreground">
            Pro Audio Headphones
          </h3>
          <p className="text-sm text-foreground/70">$299.00</p>
        </div>
        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
          🎧
        </div>
      </div>
    ),
  },
  {
    id: "prod-2",
    content: (
      <div className="p-6 bg-secondary rounded-lg flex items-center justify-between gap-4 w-full">
        <div>
          <span className="text-xs font-medium text-emerald-500">
            Sale -20%
          </span>
          <h3 className="text-lg font-semibold text-foreground">
            Mechanical Keyboard
          </h3>
          <p className="text-sm text-foreground/70">$149.00</p>
        </div>
        <div className="w-16 h-16 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
          ⌨️
        </div>
      </div>
    ),
  },
  {
    id: "prod-3",
    content: (
      <div className="p-6 bg-secondary rounded-lg flex items-center justify-between gap-4 w-full">
        <div>
          <span className="text-xs font-medium text-amber-500">Pre-Order</span>
          <h3 className="text-lg font-semibold text-foreground">
            Ultra-Wide Monitor
          </h3>
          <p className="text-sm text-foreground/70">$799.00</p>
        </div>
        <div className="w-16 h-16 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">
          🖥️
        </div>
      </div>
    ),
  },
];

// ─── Demo Page Component ──────────────────────────────────────────────────────

export default function CarouselDemoPage() {
  // Playground State Knobs
  const [variant, setVariant] = useState<CarouselVariant>("ghost");
  const [size, setSize] = useState<Size>("md");
  const [radius, setRadius] = useState<Radius>("lg");
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [autoPlayInterval, setAutoPlayInterval] = useState<number>(4000);
  const [loop, setLoop] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showIndicators, setShowIndicators] = useState<boolean>(true);
  const [pauseOnHover, setPauseOnHover] = useState<boolean>(true);
  const [disableAnimation, setDisableAnimation] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 space-y-16 max-w-7xl mx-auto">
      {/* Header */}
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Carousel Component Test Suite
        </h1>
        <p className="text-foreground/70 text-sm">
          Interactive test cases for props, sizing scales, custom render
          controls, and state management.
        </p>
      </header>

      {/* ─── SECTION 1: INTERACTIVE PLAYGROUND ─────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">1. Interactive Playground</h2>
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
            Live Configuration
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Carousel Display */}
          <div className="lg:col-span-3 flex items-center justify-center bg-secondary/40 p-4 rounded-xl border border-border">
            <Carousel
              items={HERO_SLIDES}
              variant={variant}
              size={size}
              radius={radius}
              autoPlay={autoPlay}
              autoPlayInterval={autoPlayInterval}
              loop={loop}
              showControls={showControls}
              showIndicators={showIndicators}
              pauseOnHover={pauseOnHover}
              disableAnimation={disableAnimation}
            />
          </div>

          {/* Controls Panel */}
          <div className="bg-secondary p-5 border border-border rounded-xl space-y-5 text-sm">
            <h3 className="font-semibold text-base border-b border-border pb-2">
              Properties
            </h3>

            {/* Variant */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground/70">Variant</p>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as CarouselVariant)}
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="default">default</option>
                <option value="cards">cards</option>
                <option value="bordered">bordered</option>
                <option value="ghost">ghost</option>
              </select>
            </div>

            {/* Size */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground/70">Size</p>
              <div className="grid grid-cols-3 gap-1 bg-secondary p-1 rounded-md">
                {(["sm", "md", "lg"] as Size[]).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSize(s)}
                    className={`
                      py-1 text-xs rounded uppercase font-medium transition-colors
                      ${
                        size === s
                          ? "bg-background text-foreground shadow-xs"
                          : "text-foreground/70 hover:text-foreground"
                      }
                    `}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Radius */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground/70">
                Radius Key
              </p>
              <select
                value={radius as string}
                onChange={(e) => setRadius(e.target.value as Radius)}
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="none">none</option>
                <option value="sm">sm</option>
                <option value="md">md</option>
                <option value="lg">lg</option>
                <option value="xl">xl</option>
                <option value="full">full</option>
              </select>
            </div>

            {/* AutoPlay Interval */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground/70">
                  Autoplay Speed
                </span>
                <span>{autoPlayInterval}ms</span>
              </div>
              <input
                type="range"
                min={1000}
                max={10000}
                step={500}
                value={autoPlayInterval}
                onChange={(e) => setAutoPlayInterval(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-border">
              {[
                { label: "Autoplay", value: autoPlay, setter: setAutoPlay },
                { label: "Loop Slides", value: loop, setter: setLoop },
                {
                  label: "Show Controls",
                  value: showControls,
                  setter: setShowControls,
                },
                {
                  label: "Show Indicators",
                  value: showIndicators,
                  setter: setShowIndicators,
                },
                {
                  label: "Pause on Hover",
                  value: pauseOnHover,
                  setter: setPauseOnHover,
                },
                {
                  label: "Disable Animation",
                  value: disableAnimation,
                  setter: setDisableAnimation,
                },
              ].map((toggle) => (
                <p
                  key={toggle.label}
                  className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-xs text-foreground/70">
                    {toggle.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={toggle.value}
                    onChange={(e) => toggle.setter(e.target.checked)}
                    className="rounded border-border accent-primary focus:ring-primary h-4 w-4"
                  />
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: CONTROLLED CAROUSEL & EXTERNAL NAVIGATION ─────────── */}
      {/* <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">
            2. Controlled State & Thumbnail Sync
          </h2>
          <p className="text-sm text-foreground/70">
            Control slide navigation state externally using{" "}
            <code className="text-xs bg-secondary p-1 rounded">index</code> and{" "}
            <code className="text-xs bg-secondary p-1 rounded">onIndexChange</code>.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl">
          <Carousel
            items={HERO_SLIDES}
            index={controlledIndex}
            onIndexChange={setControlledIndex}
            variant="bordered"
            size="md"
            autoPlay={false}
          />

          <div className="flex gap-3 justify-center pt-2">
            {HERO_SLIDES.map((a, idx) => (
              <button
                type="button"
                key={a.content?.toString()}
                onClick={() => setControlledIndex(idx)}
                className={`
                  "px-4 py-2 rounded-lg text-xs font-semibold border transition-all",
                  ${
                    controlledIndex === idx
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-secondary text-foreground/70 border-border hover:border-foreground/30"
                  }
                `}>
                Jump to Slide {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </section> */}

      {/* ─── SECTION 3: CUSTOM CONTROL RENDER PROPS ───────────────────────── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">3. Custom Render Controls</h2>
          <p className="text-sm text-foreground/70">
            Pass custom control elements using{" "}
            <code className="text-xs bg-secondary p-1 rounded">
              renderPrevControl
            </code>{" "}
            and{" "}
            <code className="text-xs bg-secondary p-1 rounded">
              renderNextControl
            </code>
            .
          </p>
        </div>

        <div className="max-w-3xl">
          <Carousel
            items={PRODUCT_ITEMS}
            variant="bordered"
            size="sm"
            loop={false}
            renderPrevControl={({ onClick, disabled }) => (
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 px-3 py-1.5 text-xs font-bold rounded-md bg-black/80 text-white hover:bg-black disabled:opacity-20 transition-opacity">
                ◀ PREV
              </button>
            )}
            renderNextControl={({ onClick, disabled }) => (
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 px-3 py-1.5 text-xs font-bold rounded-md bg-black/80 text-white hover:bg-black disabled:opacity-20 transition-opacity">
                NEXT ▶
              </button>
            )}
          />
        </div>
      </section>

      {/* ─── SECTION 4: CHILDREN SUB-ELEMENTS TEST ────────────────────────── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">
            4. Standard Children Injection
          </h2>
          <p className="text-sm text-foreground/70">
            Passing inline JSX{" "}
            <code className="text-xs bg-secondary p-1 rounded">children</code>{" "}
            without the{" "}
            <code className="text-xs bg-secondary p-1 rounded">items</code> prop
            array.
          </p>
        </div>

        <div className="max-w-3xl">
          <Carousel variant="ghost" size="sm" autoPlay autoPlayInterval={3000}>
            <div className="w-full h-full bg-purple-500/10 border border-purple-500/20 text-purple-600 rounded-lg flex items-center justify-center font-bold">
              Inline Child Slide #1
            </div>
            <div className="w-full h-full bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              Inline Child Slide #2
            </div>
            <div className="w-full h-full bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-lg flex items-center justify-center font-bold">
              Inline Child Slide #3
            </div>
          </Carousel>
        </div>
      </section>
    </div>
  );
}
