"use client";

import { type ResizableOrientation, ResizableScreen } from "asheeui";
import { useState } from "react";

export default function ResizableScreenTestPage() {
  // Demo 1 State (Interactive Playground)
  const [demo1Orientation, setDemo1Orientation] =
    useState<ResizableOrientation>("horizontal");
  const [demo1Size, setDemo1Size] = useState<number>(30);
  const [demo1MinSize, setDemo1MinSize] = useState<number>(15);
  const [demo1MaxSize, setDemo1MaxSize] = useState<number>(85);
  const [demo1Step, setDemo1Step] = useState<number>(5);

  // Demo 2 State (Controlled Mode)
  const [controlledSize, setControlledSize] = useState<number>(50);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 flex flex-col gap-12 font-sans">
      <header className="border-b border-neutral-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          ResizableScreen Component Test Suite
        </h1>
        <p className="text-neutral-400 mt-2">
          Test interactive pointer dragging, keyboard accessibility (Arrow Keys,
          Home, End), controlled sizes, constraints, and nested layouts.
        </p>
      </header>

      {/* ─── TEST CASE 1: Interactive Playground ──────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold text-white">
              1. Interactive Playground
            </h2>
            <p className="text-xs text-neutral-400">
              Current Size:{" "}
              <span className="font-mono text-primary-400 font-bold">
                {demo1Size.toFixed(1)}%
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {/* Orientation Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-neutral-400">Orientation:</span>
              <select
                value={demo1Orientation}
                onChange={(e) =>
                  setDemo1Orientation(e.target.value as ResizableOrientation)
                }
                className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500">
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </label>

            {/* Min Size */}
            <label className="flex items-center gap-2">
              <span className="text-neutral-400">Min %:</span>
              <input
                type="number"
                value={demo1MinSize}
                onChange={(e) => setDemo1MinSize(Number(e.target.value))}
                className="w-14 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-white"
                min={0}
                max={demo1MaxSize - 1}
              />
            </label>

            {/* Max Size */}
            <label className="flex items-center gap-2">
              <span className="text-neutral-400">Max %:</span>
              <input
                type="number"
                value={demo1MaxSize}
                onChange={(e) => setDemo1MaxSize(Number(e.target.value))}
                className="w-14 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-white"
                min={demo1MinSize + 1}
                max={100}
              />
            </label>

            {/* Keyboard Step */}
            <label className="flex items-center gap-2">
              <span className="text-neutral-400">Step %:</span>
              <input
                type="number"
                value={demo1Step}
                onChange={(e) => setDemo1Step(Number(e.target.value))}
                className="w-14 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-white"
                min={1}
                max={20}
              />
            </label>
          </div>
        </div>

        {/* Resizable Canvas Box */}
        <div className="h-87.5 w-full border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900 shadow-inner">
          <ResizableScreen
            orientation={demo1Orientation}
            defaultSize={30}
            minSize={demo1MinSize}
            maxSize={demo1MaxSize}
            step={demo1Step}
            onSizeChange={(newSize) => setDemo1Size(newSize)}>
            {/* Panel 1 */}
            <div className="h-full w-full bg-blue-950/40 p-4 flex flex-col justify-between border-neutral-800">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-blue-400">
                  Primary Panel
                </span>
                <p className="text-sm text-neutral-300 mt-2">
                  Click handle & focus with keyboard to test arrow keys, Home,
                  and End keys.
                </p>
              </div>
              <div className="text-xs font-mono text-blue-300/70">
                Width/Height: {demo1Size.toFixed(1)}%
              </div>
            </div>

            {/* Panel 2 */}
            <div className="h-full w-full bg-emerald-950/40 p-4 flex flex-col justify-between border-neutral-800">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                  Secondary Panel
                </span>
                <p className="text-sm text-neutral-300 mt-2">
                  Automatically fills remaining space.
                </p>
              </div>
              <div className="text-xs font-mono text-emerald-300/70">
                Width/Height: {(100 - demo1Size).toFixed(1)}%
              </div>
            </div>
          </ResizableScreen>
        </div>
      </section>

      {/* ─── TEST CASE 2: Controlled State ───────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              2. Fully Controlled Mode
            </h2>
            <p className="text-xs text-neutral-400">
              Size state is driven externally from parent state.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setControlledSize(25)}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs rounded transition-colors text-white border border-neutral-700">
              25%
            </button>
            <button
              type="button"
              onClick={() => setControlledSize(50)}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs rounded transition-colors text-white border border-neutral-700">
              50%
            </button>
            <button
              type="button"
              onClick={() => setControlledSize(75)}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs rounded transition-colors text-white border border-neutral-700">
              75%
            </button>

            <input
              type="range"
              min={10}
              max={90}
              value={controlledSize}
              onChange={(e) => setControlledSize(Number(e.target.value))}
              className="w-32 accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="h-62.5 w-full border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900">
          <ResizableScreen
            size={controlledSize}
            onSizeChange={(s) => setControlledSize(s)}>
            <div className="h-full w-full bg-purple-950/40 p-4 flex items-center justify-center">
              <span className="font-mono text-purple-300 font-medium">
                Panel A: {controlledSize.toFixed(0)}%
              </span>
            </div>
            <div className="h-full w-full bg-amber-950/40 p-4 flex items-center justify-center">
              <span className="font-mono text-amber-300 font-medium">
                Panel B: {(100 - controlledSize).toFixed(0)}%
              </span>
            </div>
          </ResizableScreen>
        </div>
      </section>

      {/* ─── TEST CASE 3: Complex Nested Layout (IDE Example) ───────────── */}
      <section className="flex flex-col gap-4">
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
          <h2 className="text-lg font-semibold text-white">
            3. Complex Nested Layout (IDE Workspace)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Tests horizontal outer split (Sidebar vs Workspace) with a vertical
            inner split (Editor vs Terminal).
          </p>
        </div>

        <div className="h-125 w-full border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
          <ResizableScreen
            orientation="horizontal"
            defaultSize={22}
            minSize={15}
            maxSize={40}>
            {/* Outer Left: File Explorer Sidebar */}
            <div className="h-full w-full bg-neutral-900 p-3 flex flex-col gap-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Explorer
              </span>
              <ul className="text-xs font-mono text-neutral-300 flex flex-col gap-1.5 pl-1">
                <li className="text-blue-400">📁 src</li>
                <li className="pl-3 text-neutral-400">📄 App.tsx</li>
                <li className="pl-3 text-neutral-400">📄 index.css</li>
                <li className="text-amber-400">📁 components</li>
                <li className="pl-3 text-emerald-400 font-semibold">
                  📄 ResizableScreen.tsx
                </li>
                <li className="text-neutral-400">📄 package.json</li>
              </ul>
            </div>

            {/* Outer Right: Work Area (Vertical Split) */}
            <ResizableScreen
              orientation="vertical"
              defaultSize={70}
              minSize={30}
              maxSize={85}>
              {/* Inner Top: Code Editor */}
              <div className="h-full w-full bg-neutral-950 p-4 font-mono text-xs text-neutral-300 flex flex-col justify-between">
                <div>
                  <div className="text-neutral-500 mb-2 border-b border-neutral-800 pb-1 flex justify-between">
                    <span>ResizableScreen.tsx</span>
                    <span className="text-emerald-500">● Modified</span>
                  </div>
                  <pre className="text-neutral-400 leading-relaxed overflow-auto">
                    <code>{`export const ResizableScreen = forwardRef<HTMLDivElement, ResizableScreenProps>(
  ({ children, left, size, defaultSize, ...props }, ref) => {
    // Pointer Drag & Keyboard navigation active
    return <div ref={ref} className="w-full h-full relative" />
  }
);`}</code>
                  </pre>
                </div>
                <span className="text-[10px] text-neutral-600">
                  LN 12, COL 42 | UTF-8
                </span>
              </div>

              {/* Inner Bottom: Terminal / Console Output */}
              <div className="h-full w-full bg-black p-3 font-mono text-xs text-emerald-400 flex flex-col justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-neutral-500 border-b border-neutral-900 pb-1">
                    Terminal Output
                  </div>
                  <div>$ pnpm test:components</div>
                  <div className="text-neutral-400">
                    PASS src/components/ResizableScreen.test.tsx
                  </div>
                  <div className="text-emerald-500 font-bold">
                    ✓ ResizableScreen mounted and handles pointer events.
                  </div>
                </div>
                <div className="text-[10px] text-neutral-600">
                  Terminal - zsh
                </div>
              </div>
            </ResizableScreen>
          </ResizableScreen>
        </div>
      </section>
    </div>
  );
}
