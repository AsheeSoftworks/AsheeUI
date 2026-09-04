"use client";

import {
  Marquee,
  type MarqueeAxis,
  type MarqueeDirection,
  type MarqueeSpeedPreset,
} from "asheeui";
import { useState } from "react";

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const LOGO_ITEMS = [
  {
    name: "React",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    name: "Next.js",
    color: "from-slate-500/20 to-zinc-500/20 text-slate-200 border-zinc-500/30",
  },
  {
    name: "TypeScript",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    name: "Tailwind CSS",
    color: "from-teal-500/20 to-cyan-500/20 text-teal-300 border-teal-500/30",
  },
  {
    name: "Framer Motion",
    color:
      "from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30",
  },
  {
    name: "Node.js",
    color:
      "from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    name: "GraphQL",
    color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
  },
  {
    name: "PostgreSQL",
    color: "from-sky-500/20 to-blue-600/20 text-sky-300 border-sky-500/30",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Connor",
    role: "VP of Engineering",
    text: "The marquee component eliminated all our layout jump issues.",
  },
  {
    name: "Alex Rivera",
    role: "Product Designer",
    text: "Seamless looping without needing custom pixel width math. Fantastic!",
  },
  {
    name: "Elena Rostova",
    role: "Frontend Lead",
    text: "Pause on hover and reduced-motion accessibility work out of the box.",
  },
  {
    name: "Marcus Chen",
    role: "CTO @ TechFlow",
    text: "Smooth 60fps scrolling across both desktop and mobile devices.",
  },
];

const NOTIFICATIONS = [
  { title: "🎉 Release v2.4.0", time: "2m ago" },
  { title: "⭐ New GitHub Star", time: "5m ago" },
  { title: "🚀 Deployment Successful", time: "12m ago" },
  { title: "💬 New Comment received", time: "18m ago" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MarqueeDemoPage() {
  // Playground State Controls
  const [axis, setAxis] = useState<MarqueeAxis>("x");
  const [direction, setDirection] = useState<MarqueeDirection>("forward");
  const [speed, setSpeed] = useState<MarqueeSpeedPreset>("normal");
  const [gap, setGap] = useState("1.5rem");
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [fadeEdges, setFadeEdges] = useState(true);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Marquee Component
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
            Interactive Test Suite
          </span>
        </div>
        <p className="text-foreground/70 mt-2">
          Seamless infinite looping track supporting horizontal/vertical axes,
          customizable speed presets, and edge masking.
        </p>
      </div>

      {/* ─── 1. INTERACTIVE PLAYGROUND ───────────────────────────────────────── */}
      <section className="p-6 border rounded-xl bg-secondary/50 space-y-6">
        <h2 className="text-lg font-semibold border-b pb-3">
          Interactive Playground
        </h2>

        {/* Controls Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          {/* Axis */}
          <div className="space-y-1.5">
            <label
              htmlFor="axis-select"
              className="font-medium text-foreground/70">
              Axis
            </label>
            <select
              id="axis-select"
              value={axis}
              onChange={(e) => setAxis(e.target.value as MarqueeAxis)}
              className="w-full p-2 rounded-md border bg-background font-medium">
              <option value="x">X (Horizontal)</option>
              <option value="y">Y (Vertical)</option>
            </select>
          </div>

          {/* Direction */}
          <div className="space-y-1.5">
            <label
              htmlFor="direction-select"
              className="font-medium text-foreground/70">
              Direction
            </label>
            <select
              id="direction-select"
              value={direction}
              onChange={(e) => setDirection(e.target.value as MarqueeDirection)}
              className="w-full p-2 rounded-md border bg-background font-medium">
              <option value="forward">Forward</option>
              <option value="reverse">Reverse</option>
            </select>
          </div>

          {/* Speed */}
          <div className="space-y-1.5">
            <label
              htmlFor="speed-select"
              className="font-medium text-foreground/70">
              Speed
            </label>
            <select
              id="speed-select"
              value={speed}
              onChange={(e) => setSpeed(e.target.value as MarqueeSpeedPreset)}
              className="w-full p-2 rounded-md border bg-background font-medium">
              <option value="fast">Fast</option>
              <option value="normal">Normal</option>
              <option value="slow">Slow</option>
            </select>
          </div>

          {/* Gap */}
          <div className="space-y-1.5">
            <label
              htmlFor="gap-select"
              className="font-medium text-foreground/70">
              Gap
            </label>
            <select
              id="gap-select"
              value={gap}
              onChange={(e) => setGap(e.target.value)}
              className="w-full p-2 rounded-md border bg-background font-medium">
              <option value="0.75rem">0.75rem (12px)</option>
              <option value="1.5rem">1.5rem (24px)</option>
              <option value="3rem">3rem (48px)</option>
            </select>
          </div>

          {/* Pause On Hover Toggle */}
          <div className="space-y-1.5">
            <span className="font-medium text-foreground/70 block">
              Pause on Hover
            </span>
            <button
              type="button"
              onClick={() => setPauseOnHover((prev) => !prev)}
              className={`w-full p-2 rounded-md border font-semibold transition-colors ${
                pauseOnHover
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-background text-foreground/70"
              }`}>
              {pauseOnHover ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* Fade Edges Toggle */}
          <div className="space-y-1.5">
            <span className="font-medium text-foreground/70 block">
              Fade Edges
            </span>
            <button
              type="button"
              onClick={() => setFadeEdges((prev) => !prev)}
              className={`w-full p-2 rounded-md border font-semibold transition-colors ${
                fadeEdges
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-background text-foreground/70"
              }`}>
              {fadeEdges ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div className="border rounded-lg bg-background p-4 overflow-hidden min-h-55 flex items-center justify-center">
          <Marquee
            axis={axis}
            direction={direction}
            speed={speed}
            gap={gap}
            pauseOnHover={pauseOnHover}
            fadeEdges={fadeEdges}
            className={axis === "y" ? "h-65" : "w-full"}>
            {LOGO_ITEMS.map((item) => (
              <div
                key={item.name}
                className={`px-5 py-3 rounded-lg border bg-linear-to-r ${item.color} font-medium text-sm flex items-center gap-2 shadow-xs`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {item.name}
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ─── 2. PRESET SCENARIOS SHOWCASE ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scenario A: Dual Opposite Streams */}
        <section className="p-6 border rounded-xl bg-secondary/50 space-y-4">
          <div>
            <h3 className="font-semibold text-base">Dual Opposite Streams</h3>
            <p className="text-xs text-foreground/70">
              Stacked marquees moving in opposing directions for visual energy.
            </p>
          </div>

          <div className="space-y-3">
            <Marquee speed="fast" direction="forward" gap="1rem">
              {LOGO_ITEMS.slice(0, 4).map((item) => (
                <div
                  key={item.name}
                  className="px-4 py-2 border rounded-md text-xs font-semibold bg-secondary/40">
                  {item.name}
                </div>
              ))}
            </Marquee>

            <Marquee speed="fast" direction="reverse" gap="1rem">
              {LOGO_ITEMS.slice(4).map((item) => (
                <div
                  key={item.name}
                  className="px-4 py-2 border rounded-md text-xs font-semibold bg-secondary/40">
                  {item.name}
                </div>
              ))}
            </Marquee>
          </div>
        </section>

        {/* Scenario B: Vertical Activity Stream */}
        <section className="p-6 border rounded-xl bg-secondary/50 space-y-4">
          <div>
            <h3 className="font-semibold text-base">Vertical Activity Feed</h3>
            <p className="text-xs text-foreground/70">
              Y-axis loop useful for notifications, recent sales, or live logs.
            </p>
          </div>

          <div className="h-40 border rounded-lg bg-background p-2">
            <Marquee axis="y" speed="slow" gap="0.75rem" className="h-full">
              {NOTIFICATIONS.map((notif) => (
                <div
                  key={notif.title}
                  className="px-3 py-2 text-xs border rounded-md bg-secondary flex items-center justify-between gap-4">
                  <span className="font-medium">{notif.title}</span>
                  <span className="text-[10px] text-foreground/70">
                    {notif.time}
                  </span>
                </div>
              ))}
            </Marquee>
          </div>
        </section>
      </div>

      {/* Scenario C: Full-Width Testimonials Loop */}
      <section className="p-6 border rounded-xl bg-secondary/50 space-y-4">
        <div>
          <h3 className="font-semibold text-base">Testimonial Cards</h3>
          <p className="text-xs text-foreground/70">
            Rich card layouts with hover-pause enabled for easy reading.
          </p>
        </div>

        <Marquee speed="slow" gap="2rem" pauseOnHover fadeEdges>
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="w-75 p-4 rounded-xl border bg-background shadow-xs space-y-2 flex flex-col justify-between">
              <p className="text-xs text-foreground/70 leading-relaxed italic">
                &quot;{t.text}&quot;
              </p>
              <div className="pt-2 border-t">
                <p className="text-xs font-bold text-foreground">{t.name}</p>
                <p className="text-[10px] text-foreground/70">{t.role}</p>
              </div>
            </div>
          ))}
        </Marquee>
      </section>
    </div>
  );
}
