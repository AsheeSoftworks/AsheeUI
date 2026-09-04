"use client";

import {
  Input,
  KeyboardProvider,
  OnScreenKeyboard,
  useKeyboard,
} from "asheeui";
import { useState } from "react";

// ─── Form Interface & Initial State ──────────────────────────────────────────

interface FormDataState {
  firstName: string;
  lastName: string;
  email: string;
  zipCode: string;
}

const INITIAL_FORM_DATA: FormDataState = {
  firstName: "",
  lastName: "",
  email: "",
  zipCode: "",
};

// ─── Debug & Control Panel ────────────────────────────────────────────────────

interface KeyboardDebuggerProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  submittedData: FormDataState | null;
}

function KeyboardDebugger({
  formData,
  setFormData,
  submittedData,
}: KeyboardDebuggerProps) {
  const { isOpen, forceClose } = useKeyboard();

  const handlePrefill = () => {
    setFormData({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      zipCode: "90210",
    });
  };

  const handleClear = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  const filledCount = Object.values(formData).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Real-time State Monitor */}
      <div className="rounded-xl border border-border bg-secondary p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="font-semibold text-foreground text-base">
            Keyboard State Monitor
          </h2>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              isOpen
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-secondary text-foreground/70 border border-border"
            }`}>
            <span
              className={`h-2 w-2 rounded-full ${
                isOpen ? "bg-emerald-500 animate-pulse" : "bg--foreground/70"
              }`}
            />
            {isOpen ? "Active" : "Hidden"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-foreground/70 text-xs block mb-1">
              Active Field (`name`)
            </span>
            {/* <code className="bg-secondary px-2 py-1 rounded font-mono text-xs text-foreground block truncate">
              {isOpen && activeInput ? activeInput : "(none)"}
            </code> */}
          </div>
          <div>
            <span className="text-foreground/70 text-xs block mb-1">
              Filled Fields
            </span>
            <code className="bg-secondary px-2 py-1 rounded font-mono text-xs text-foreground block">
              {filledCount} / {Object.keys(formData).length} populated
            </code>
          </div>
        </div>

        {/* Live Values JSON */}
        <div>
          <span className="text-foreground/70 text-xs block mb-1">
            React Local State (`useState`)
          </span>
          <pre className="bg-secondary/70 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-border max-h-40 text-foreground">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>

        {/* Programmatic Control Actions */}
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePrefill}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-foreground/70 hover:bg-secondary/80 transition-colors">
            Pre-fill Sample Data
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-colors">
            Clear All Fields
          </button>
          <button
            type="button"
            onClick={forceClose}
            disabled={!isOpen}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-foreground/70 hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Force Close Keyboard
          </button>
        </div>
      </div>

      {/* Form Submission Payload Output */}
      {submittedData && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Form Submitted Successfully!
          </h3>
          <pre className="text-xs font-mono bg-background/80 p-2.5 rounded border border-emerald-500/20 text-foreground overflow-x-auto">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Main Test Form Component ─────────────────────────────────────────────────

interface KeyboardTestFormProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  setSubmittedData: (data: FormDataState | null) => void;
}

function KeyboardTestForm({
  formData,
  setFormData,
  setSubmittedData,
}: KeyboardTestFormProps) {
  const { forceClose } = useKeyboard();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(formData);
    forceClose();
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setSubmittedData(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-secondary p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Test Form</h2>
        <p className="text-xs text-foreground/70 mt-0.5">
          Focus any input below to trigger the virtual keyboard with native UI
          components.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Input 1: First Name */}
        <Input
          enableVirtualKeyboard
          id="firstName"
          name="firstName"
          label="First Name"
          placeholder="e.g. Jane"
          value={formData.firstName}
          onChange={handleChange}
        />

        {/* Input 2: Last Name */}
        <Input
          enableVirtualKeyboard
          id="lastName"
          name="lastName"
          label="Last Name"
          placeholder="e.g. Doe"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      {/* Input 3: Email */}
      <Input
        enableVirtualKeyboard
        id="email"
        name="email"
        type="email"
        label="Email Address"
        placeholder="e.g. jane@example.com"
        value={formData.email}
        onChange={handleChange}
      />

      {/* Input 4: Zip Code */}
      <Input
        enableVirtualKeyboard
        id="zipCode"
        name="zipCode"
        label="ZIP / Postal Code"
        placeholder="e.g. 90210"
        value={formData.zipCode}
        onChange={handleChange}
      />

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
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
    {
      label: "Native Input Integration",
      desc: "Uses native <Input enableVirtualKeyboard /> directly",
    },
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
      desc: "Dispatches native events and updates React useState live",
    },
    { label: "Escape key", desc: "Closes virtual keyboard instantly" },
  ];

  return (
    <div className="rounded-xl border border-border bg-secondary p-5 shadow-sm space-y-3">
      <h3 className="font-semibold text-foreground text-sm">
        Verification Test Cases
      </h3>
      <ul className="space-y-2 text-xs text-foreground/70">
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
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM_DATA);
  const [submittedData, setSubmittedData] = useState<FormDataState | null>(
    null,
  );

  return (
    <KeyboardProvider autoShiftBack={true} closeDelay={150}>
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 md:p-12 pb-80">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <header className="border-b border-border pb-5">
            <h1 className="text-2xl font-bold tracking-tight">
              On-Screen Keyboard Verification
            </h1>
            <p className="text-sm text-foreground/70 mt-1">
              Test harness for virtual keyboard input binding using native
              component architecture.
            </p>
          </header>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Testing */}
            <div className="lg:col-span-7 space-y-6">
              <KeyboardTestForm
                formData={formData}
                setFormData={setFormData}
                setSubmittedData={setSubmittedData}
              />
              <TestingChecklist />
            </div>

            {/* Right Column: Live Debug & Controls */}
            <div className="lg:col-span-5">
              <KeyboardDebugger
                formData={formData}
                setFormData={setFormData}
                submittedData={submittedData}
              />
            </div>
          </div>
        </div>

        {/* Floating On-Screen Keyboard */}
        <OnScreenKeyboard />
      </div>
    </KeyboardProvider>
  );
}
