"use client";

import { type ColumnDef, Table, type TableVariant } from "@ashee/ui";
import { useMemo, useState } from "react";

// ─── Type Definitions ─────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Developer" | "Designer" | "Manager";
  status: "Active" | "Inactive" | "Pending";
  balance: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USERS: User[] = [
  {
    id: "usr_1",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "Admin",
    status: "Active",
    balance: 4250.0,
  },
  {
    id: "usr_2",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Developer",
    status: "Active",
    balance: 1820.5,
  },
  {
    id: "usr_3",
    name: "James Wilson",
    email: "james.wilson@example.com",
    role: "Designer",
    status: "Pending",
    balance: 850.0,
  },
  {
    id: "usr_4",
    name: "Elena Rostova",
    email: "elena.rostova@example.com",
    role: "Manager",
    status: "Inactive",
    balance: 0.0,
  },
  {
    id: "usr_5",
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    role: "Developer",
    status: "Active",
    balance: 3100.25,
  },
];

// ─── Component Test Suite ─────────────────────────────────────────────────────

export default function TableDemo() {
  const [selectedId, setSelectedId] = useState<string | number>("usr_2");
  const [variant, setVariant] = useState<TableVariant>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lastAction, setLastAction] = useState<string>("None");

  // Filter Users
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_USERS;
    return MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // Define Columns
  const columns: ColumnDef<User>[] = [
    {
      id: "name",
      header: "User",
      cell: (user) => (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (user) => <span className="text-sm">{user.role}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (user) => {
        const statusColors: Record<User["status"], string> = {
          Active:
            "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          Pending:
            "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
          Inactive:
            "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/20",
        };

        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border ${
              statusColors[user.status]
            }`}>
            {user.status}
          </span>
        );
      },
    },
    {
      id: "balance",
      header: "Balance",
      cell: (user) => (
        <span className="font-mono text-sm">
          ${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (user) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggers on parent row
            setLastAction(`Clicked action button for ${user.name}`);
          }}
          className="px-2 py-1 text-xs border border-border rounded hover:bg-muted transition-colors">
          Manage
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold mb-1">Table Component Test Suite</h1>
        <p className="text-sm text-muted-foreground">
          Interactive evaluation for grid renderers, selection events, and
          design tokens.
        </p>
      </div>

      {/* ─── CONTROLS BAR ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border bg-card">
        {/* Search Input */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="table-search"
            className="text-xs font-semibold uppercase text-muted-foreground">
            Filter:
          </label>
          <input
            id="table-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type 'Admin', 'Sarah', or bogus..."
            className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Variant Selectors */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Variant:
          </span>
          {(["default", "striped", "bordered", "flush"] as TableVariant[]).map(
            (v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                  variant === v
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:bg-muted"
                }`}>
                {v}
              </button>
            ),
          )}
        </div>
      </div>

      {/* ─── TABLE VIEWPORT ────────────────────────────────────────────────────── */}
      <div>
        <Table<User>
          data={filteredUsers}
          columns={columns}
          variant={variant}
          rowKeyAccessor={(user) => user.id}
          selectedRowKey={selectedId}
          handleClick={(user, id) => {
            if (id) setSelectedId(id);
            setLastAction(`Single-clicked row for ${user.name} (${id})`);
          }}
          handleDoubleClick={(user, id) => {
            setLastAction(`DOUBLE-CLICKED row for ${user.name} (${id})`);
          }}
          emptyMessage={
            <div className="py-8 space-y-2">
              <p className="text-base font-semibold">No users found</p>
              <p className="text-xs text-muted-foreground">
                Try clearing your search term{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  "{searchQuery}"
                </code>
              </p>
            </div>
          }
        />
      </div>

      {/* ─── EVENT READOUT & STATE LOG ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border bg-card text-xs space-y-2">
          <div className="font-semibold text-muted-foreground uppercase">
            Selected Row State
          </div>
          <div className="font-mono">
            {selectedId ? (
              <div>
                Active Row Key:{" "}
                <span className="font-bold text-primary">
                  {String(selectedId)}
                </span>
              </div>
            ) : (
              <div className="text-muted-foreground">No row selected</div>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-card text-xs space-y-2">
          <div className="font-semibold text-muted-foreground uppercase">
            Last Registered Event
          </div>
          <div className="font-mono text-foreground">{lastAction}</div>
        </div>
      </div>
    </div>
  );
}
