"use client";

import {
  ArrowLeftIcon,
  ClockIcon,
  type ColumnDef,
  ResizableScreen,
  Sidebar,
  Table,
} from "@ashee/ui";
import { useState } from "react";

// Mock User Data
interface UserRow {
  id: string;
  name: string;
  role: string;
  status: "active" | "offline";
}

const mockUsers: UserRow[] = [
  { id: "usr-1", name: "Alex Chen", role: "Frontend Lead", status: "active" },
  {
    id: "usr-2",
    name: "Sarah Jenkins",
    role: "Product Designer",
    status: "active",
  },
  {
    id: "usr-3",
    name: "Michael Vance",
    role: "DevOps Engineer",
    status: "offline",
  },
];

const columns: ColumnDef<UserRow>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
  { id: "role", header: "Role", cell: (row) => row.role },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <span
        className={`px-2 py-0.5 text-xs rounded-full font-medium ${
          row.status === "active"
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-muted text-muted-foreground"
        }`}>
        {row.status}
      </span>
    ),
  },
];

export default function PlaygroundGlobalPage() {
  const [activeNav, setActiveNav] = useState("users");

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* 1. Sidebar (Inherits global 'bordered' variant & 'md' size) */}
      <Sidebar
        title="Admin Portal"
        activeKey={activeNav}
        onSelect={(item) => setActiveNav(String(item))}
        items={[
          { id: "users", label: "Users List" },
          { id: "settings", label: "Global Settings" },
        ]}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <ArrowLeftIcon className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground" />
            <h1 className="text-xl font-bold">Global Config Playground</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="w-4 h-4" />
            <span>Defaults Mode</span>
          </div>
        </div>

        {/* 2. Resizable Handle Demo */}
        <ResizableScreen className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Split Panel Resizable Handle
          </h2>
          <div className="flex h-32 w-full border border-border rounded-md overflow-hidden bg-muted/10">
            <div className="flex-1 p-4 text-xs text-muted-foreground flex items-center justify-center">
              Left Panel Container
            </div>

            {/* Accessible <hr> Resizable Handle */}
            <hr
              tabIndex={0}
              aria-valuenow={50}
              aria-valuemin={20}
              aria-valuemax={80}
              aria-orientation="horizontal"
              aria-label="Resize panel split"
              className="m-0 border-none bg-border hover:bg-primary transition-colors w-2 h-full cursor-col-resize shrink-0 focus-visible:ring-2 focus-visible:ring-primary outline-none"
            />

            <div className="flex-1 p-4 text-xs text-muted-foreground flex items-center justify-center">
              Right Panel Container
            </div>
          </div>
        </ResizableScreen>

        {/* 3. Semantic Table (Inherits global 'flush' variant & 'md' size) */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Global Semantic Table
          </h2>
          <div className="h-64">
            <Table data={mockUsers} columns={columns} />
          </div>
        </section>

        {/* 4. Global Toast Default Notification */}
        {/* <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Toast (Global Variant)
            </h2>
            <div className="max-w-md">
              <Toast
                id="toast-global-1"
                type="info"
                title="System Synchronized"
                message="All components are rendering defaults from AsheeConfigProvider."
                icon={<CheckIcon className="w-4 h-4 text-emerald-500" />}
                onDismiss={() => {}}
              />
            </div>
          </section> */}
      </main>
    </div>
  );
}
