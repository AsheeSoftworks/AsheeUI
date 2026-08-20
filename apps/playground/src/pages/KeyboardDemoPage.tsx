"use client";

import {
  KeyboardInput,
  KeyboardProvider,
  OnScreenKeyboard,
  useKeyboard,
} from "asheeui/keyboard";

// import { useState } from "react";

// ─── Debug & Control Panel ────────────────────────────────────────────────────

function KeyboardDebugger() {
  const { isOpen, activeInput, inputs, forceClose, clearInputs, setInput } =
    useKeyboard();

  //   const [submittedData, setSubmittedData] = useState<Record<
  //     string,
  //     string
  //   > | null>(null);

  const handlePrefill = () => {
    setInput("firstName", "John");
    setInput("lastName", "Doe");
    setInput("email", "john.doe@example.com");
    setInput("zipCode", "90210");
  };

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setSubmittedData(inputs);
  //     forceClose();
  //   };

  return (
    <div className="space-y-6">
      {/* Real-time State Monitor */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="font-semibold text-foreground text-base">
            Keyboard State Monitor
          </h2>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              isOpen
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-muted text-muted-foreground border border-border"
            }`}>
            <span
              className={`h-2 w-2 rounded-full ${
                isOpen ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
              }`}
            />
            {isOpen ? "Active" : "Hidden"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground text-xs block mb-1">
              Active Input ID
            </span>
            <code className="bg-muted px-2 py-1 rounded font-mono text-xs text-foreground block truncate">
              {isOpen ? activeInput : "(none)"}
            </code>
          </div>
          <div>
            <span className="text-muted-foreground text-xs block mb-1">
              Field Count
            </span>
            <code className="bg-muted px-2 py-1 rounded font-mono text-xs text-foreground block">
              {Object.keys(inputs).length} registered
            </code>
          </div>
        </div>

        {/* Live Values JSON */}
        <div>
          <span className="text-muted-foreground text-xs block mb-1">
            Live Input Values (`inputs`)
          </span>
          <pre className="bg-muted/70 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-border max-h-40 text-foreground">
            {JSON.stringify(inputs, null, 2)}
          </pre>
        </div>

        {/* Programmatic Control Actions */}
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePrefill}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
            Pre-fill Sample Data
          </button>
          <button
            type="button"
            onClick={clearInputs}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-colors">
            Clear All Inputs
          </button>
          <button
            type="button"
            onClick={forceClose}
            disabled={!isOpen}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Force Close Keyboard
          </button>
        </div>
      </div>

      {/* Form Submission Payload Output */}
      {/* {submittedData && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Form Submitted Successfully!
          </h3>
          <pre className="text-xs font-mono bg-background/80 p-2.5 rounded border border-emerald-500/20 text-foreground overflow-x-auto">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )} */}
    </div>
  );
}

// ─── Main Test Form Component ─────────────────────────────────────────────────

function KeyboardTestForm() {
  const { forceClose } = useKeyboard();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        alert(`Form Submitted:\n${JSON.stringify(data, null, 2)}`);
        forceClose();
      }}
      className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Test Form</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Focus any input below to launch the virtual keyboard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Input 1: Standard Text */}
        <div className="space-y-1.5">
          <label
            htmlFor="firstName"
            className="text-xs font-medium text-foreground">
            First Name
          </label>
          <KeyboardInput
            id="firstName"
            name="firstName"
            placeholder="e.g. Jane"
          />
        </div>

        {/* Input 2: Standard Text */}
        <div className="space-y-1.5">
          <label
            htmlFor="lastName"
            className="text-xs font-medium text-foreground">
            Last Name
          </label>
          <KeyboardInput id="lastName" name="lastName" placeholder="e.g. Doe" />
        </div>
      </div>

      {/* Input 3: Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-medium text-foreground">
          Email Address
        </label>
        <KeyboardInput
          id="email"
          name="email"
          type="email"
          placeholder="e.g. jane@example.com"
        />
      </div>

      {/* Input 4: Zip Code / Numbers */}
      <div className="space-y-1.5">
        <label
          htmlFor="zipCode"
          className="text-xs font-medium text-foreground">
          ZIP / Postal Code
        </label>
        <KeyboardInput id="zipCode" name="zipCode" placeholder="e.g. 90210" />
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-end gap-3">
        <button
          type="reset"
          className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-accent transition-colors">
          Reset
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors">
          Submit Form
        </button>
      </div>
    </form>
  );
}

// ─── Test Suite Checklist ─────────────────────────────────────────────────────

function TestingChecklist() {
  const tests = [
    { label: "Focus input", desc: "Keyboard slides up smoothly from bottom" },
    {
      label: "{shift} key",
      desc: "Toggles uppercase layout & auto-shifts back after 1 keypress",
    },
    { label: "{symbols} key", desc: "Switches to special character layout" },
    {
      label: "{bksp} & {clear}",
      desc: "Deletes character at cursor position / clears current field",
    },
    {
      label: "Physical typing",
      desc: "Highlights corresponding virtual key in real time",
    },
    { label: "Escape key", desc: "Closes virtual keyboard instantly" },
    {
      label: "Tab / Focus Switch",
      desc: "Maintains active state without closing keyboard glitch",
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
      <h3 className="font-semibold text-foreground text-sm">
        Verification Test Cases
      </h3>
      <ul className="space-y-2 text-xs text-muted-foreground">
        {tests.map((test) => (
          <li key={test.label} className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            <div>
              <strong className="text-foreground font-medium">
                {test.label}:
              </strong>{" "}
              {test.desc}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Full Page Export ─────────────────────────────────────────────────────────

export default function KeyboardDemoPage() {
  return (
    <KeyboardProvider autoShiftBack={true} closeDelay={150}>
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 md:p-12 pb-80">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <header className="border-b border-border pb-5">
            <h1 className="text-2xl font-bold tracking-tight">
              On-Screen Keyboard Verification
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Interactive test harness for virtual keyboard input binding,
              layout handling, and physical keyboard sync.
            </p>
          </header>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Testing */}
            <div className="lg:col-span-7 space-y-6">
              <KeyboardTestForm />
              <TestingChecklist />
            </div>

            {/* Right Column: Live Debug & Controls */}
            <div className="lg:col-span-5">
              <KeyboardDebugger />
            </div>
          </div>
        </div>

        {/* Floating On-Screen Keyboard */}
        <OnScreenKeyboard />
      </div>
    </KeyboardProvider>
  );
}
