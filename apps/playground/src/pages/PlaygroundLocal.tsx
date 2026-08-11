"use client";

import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  type ColumnDef,
  EyeOffIcon,
  Sidebar,
  Table,
} from "@ashee/ui";
import { useMemo, useState } from "react";

interface ProjectRow {
  id: string;
  title: string;
  category: string;
  budget: string;
}

const mockProjects: ProjectRow[] = [
  {
    id: "proj-101",
    title: "AsheeUI Component Library",
    category: "Open Source",
    budget: "$12,000",
  },
  {
    id: "proj-102",
    title: "POS Desktop Overhaul",
    category: "C++ / wxWidgets",
    budget: "$28,500",
  },
  {
    id: "proj-103",
    title: "EliteFreelancer Platform",
    category: "Next.js Web",
    budget: "$15,400",
  },
];

const columns: ColumnDef<ProjectRow>[] = [
  { id: "title", header: "Project Title", cell: (row) => row.title },
  { id: "category", header: "Category", cell: (row) => row.category },
  { id: "budget", header: "Budget", cell: (row) => row.budget },
];

export default function PlaygroundLocalPage() {
  const [selectedRowId, setSelectedRowId] = useState<string | number>(
    "proj-102",
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Calendar cells mapping with useMemo to ensure stable key generation
  const calendarDays = [null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const memoizedCells = useMemo(() => {
    return calendarDays.map((day, idx) => ({
      key: day !== null ? `cell-day-${day}` : `empty-slot-${idx}`,
      day,
    }));
  }, [calendarDays]);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* 1. Sidebar with Local Overrides (Floating variant, lg size, custom back icon) */}
      <Sidebar
        variant="floating"
        size="lg"
        radius="lg"
        isCollapsed={isSidebarCollapsed}
        title="Override Studio"
        onBack={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        backIcon={<ChevronLeftIcon className="w-4 h-4" />}
        activeKey="projects"
        items={[
          { id: "projects", label: "Active Projects" },
          { id: "analytics", label: "System Analytics" },
        ]}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h1 className="text-xl font-bold">Local Props Override Playground</h1>
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-card hover:bg-muted transition-colors">
            Toggle Sidebar Collapse
          </button>
        </div>

        {/* 2. Calendar Grid Test (Testing useMemo cell key generation & Chevron icons) */}
        <section className="p-4 border border-border rounded-xl bg-card max-w-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-sm">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <span>August 2026</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                className="p-1 rounded hover:bg-muted">
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                className="p-1 rounded hover:bg-muted">
                <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                type="button"
                aria-label="Hide calendar"
                className="p-1 rounded hover:bg-muted">
                <EyeOffIcon className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={`header-${d}-${i}`}
                className="font-semibold text-muted-foreground py-1">
                {d}
              </div>
            ))}
            {memoizedCells.map(({ key, day }) =>
              day === null ? (
                <div key={key} />
              ) : (
                <button
                  key={key}
                  type="button"
                  className={`py-1.5 rounded-md transition-colors ${
                    day === 10
                      ? "bg-primary text-primary-foreground font-bold"
                      : "hover:bg-muted text-foreground"
                  }`}>
                  {day}
                </button>
              ),
            )}
          </div>
        </section>

        {/* 3. Table with Local Overrides (Striped variant, small size, interactive row clicks) */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Interactive Table (Striped / Small / Custom Click)
            </h2>
            <span className="text-xs text-muted-foreground">
              Selected ID:{" "}
              <code className="text-primary font-mono">{selectedRowId}</code>
            </span>
          </div>
          <div className="h-64">
            <Table
              data={mockProjects}
              columns={columns}
              variant="striped"
              size="sm"
              radius="sm"
              selectedRowKey={selectedRowId}
              handleClick={(row) => setSelectedRowId(row.id)}
            />
          </div>
        </section>

        {/* 4. Toast with Local Overrides (Solid variant, warning type, custom action) */}
        {/* {showToast && (
          <section className="space-y-2 max-w-md">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Solid Variant Toast Override
            </h2>
            <Toast
              id="toast-local-override"
              type="warning"
              variant="solid"
              title="Storage Limit Reached"
              message="Your current subscription allows up to 10 active repos."
              action={
                <button
                  type="button"
                  onClick={() => alert("Redirecting to billing...")}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-white text-amber-950 hover:bg-amber-100 transition-colors">
                  Upgrade Plan
                </button>
              }
              icon={<ClearIcon className="w-4 h-4 text-white" />}
              dismissible
              onDismiss={() => setShowToast(false)}
            />
          </section>
        )} */}
      </main>
    </div>
  );
}
