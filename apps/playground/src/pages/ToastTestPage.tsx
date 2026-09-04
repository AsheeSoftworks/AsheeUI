"use client";

import { Button, ToastProvider, useToast } from "asheeui";

function ToastTestControls() {
  const { success, error, info, warning, toast, clearToasts, toasts } =
    useToast();

  return (
    <div className="p-12 max-w-4xl mx-auto space-y-8 bg-background text-foreground min-h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-1">Toast Component Test Suite</h1>
        <p className="text-sm text-foreground/70">
          Active toasts: <span className="font-semibold">{toasts.length}</span>
        </p>
      </div>

      {/* Basic Toast Types */}
      <section className="space-y-3">
        <h2 className="text-md font-semibold border-b border-border pb-2">
          1. Notification Types
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              success("Settings updated successfully!", {
                title: "Success",
              })
            }
            className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition">
            Trigger Success
          </Button>

          <Button
            onClick={() =>
              error("Could not connect to the database.", {
                title: "Connection Error",
              })
            }
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:opacity-90 transition">
            Trigger Error
          </Button>

          <Button
            onClick={() =>
              info("A new software update is available.", {
                title: "System Update",
              })
            }
            className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition">
            Trigger Info
          </Button>

          <Button
            onClick={() =>
              warning("Your storage space is reaching its limit.", {
                title: "Storage Low",
              })
            }
            className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700 transition">
            Trigger Warning
          </Button>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="space-y-3">
        <h2 className="text-md font-semibold border-b border-border pb-2">
          2. Advanced Options & Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              toast({
                title: "Item Deleted",
                message: "File 'report.pdf' was moved to trash.",
                type: "info",
                timeout: 8000,
                action: (
                  <Button
                    onClick={() => alert("Undo clicked!")}
                    className="text-xs font-semibold underline hover:no-underline text-primary">
                    Undo
                  </Button>
                ),
              })
            }
            className="px-4 py-2 bg-secondary text-foreground/70 rounded-md text-sm font-medium hover:opacity-80 transition">
            Toast with Action
          </Button>

          <Button
            onClick={() =>
              info("This toast will stay open for 10 seconds.", {
                title: "Long Timeout",
                timeout: 10000,
              })
            }
            className="px-4 py-2 bg-secondary text-foreground/70 rounded-md text-sm font-medium hover:opacity-80 transition">
            10s Timeout
          </Button>

          <Button
            onClick={clearToasts}
            className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-secondary transition">
            Clear All Toasts
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function ToastTestPage() {
  return (
    <ToastProvider variant="underlined">
      <ToastTestControls />
    </ToastProvider>
  );
}
