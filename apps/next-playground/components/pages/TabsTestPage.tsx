"use client";

import type { Radius } from "asheeui";
import {
  type TabItem,
  Tabs,
  type TabsSizeKey,
  type TabsVariant,
  Text,
} from "asheeui";
import { useState } from "react";

// ─── Test Tab Data ────────────────────────────────────────────────────────────

const defaultTabs: TabItem[] = [
  {
    id: "account",
    label: "Account",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    content: (
      <div className="p-6 rounded-lg bg-card border border-border shadow-xs space-y-3">
        <h3 className="text-lg font-semibold">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal account details, display name, and avatar
          preferences.
        </p>
        <div className="pt-2 flex gap-3">
          <input
            type="text"
            placeholder="John Doe"
            className="p-2 text-xs rounded border border-input bg-background w-64"
          />
        </div>
      </div>
    ),
  },
  {
    id: "notifications",
    label: "Notifications",
    badge: 4,
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    content: (
      <div className="p-6 rounded-lg bg-card border border-border shadow-xs space-y-3">
        <h3 className="text-lg font-semibold">Notification Center</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive activity updates and digest emails.
        </p>
        <div className="space-y-2 pt-2">
          <Text
            as="label"
            className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="rounded text-primary"
            />
            Email Activity Digest
          </Text>
          <Text
            as="label"
            className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="rounded text-primary"
            />
            Push Notifications
          </Text>
        </div>
      </div>
    ),
  },
  {
    id: "security",
    label: "Security",
    badge: "New",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    content: (
      <div className="p-6 rounded-lg bg-card border border-border shadow-xs space-y-3">
        <h3 className="text-lg font-semibold">Security & Authentication</h3>
        <p className="text-sm text-muted-foreground">
          Update password and manage Two-Factor Authentication (2FA) sessions.
        </p>
        <button
          type="button"
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground">
          Enable 2FA
        </button>
      </div>
    ),
  },
  {
    id: "billing",
    label: "Billing",
    disabled: true,
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    content: (
      <div className="p-6 rounded-lg bg-card border border-border shadow-xs">
        <h3 className="text-lg font-semibold">Billing Overview</h3>
        <p className="text-sm text-muted-foreground">Disabled tab content.</p>
      </div>
    ),
  },
];

// ─── Main Test Page Component ─────────────────────────────────────────────────

export default function TabsTestPage() {
  // Tabs State & Mode
  const [isControlled, setIsControlled] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string | number>("account");
  const [lastChangeEvent, setLastChangeEvent] = useState<string>("None");

  // Tab Config Controls
  const [variant, setVariant] = useState<TabsVariant>("underline");
  const [size, setSize] = useState<TabsSizeKey>("md");
  const [radius, setRadius] = useState<keyof Radius>("md");
  const [fullWidth, setFullWidth] = useState(false);
  const [hasIcons, setHasIcons] = useState(true);
  const [hasBadges, setHasBadges] = useState(true);

  // Dynamic Tabs Data based on Icon / Badge toggles
  const processedTabs = defaultTabs.map((tab) => ({
    ...tab,
    icon: hasIcons ? tab.icon : undefined,
    badge: hasBadges ? tab.badge : undefined,
  }));

  const handleTabChange = (id: string | number) => {
    setLastChangeEvent(`onChange triggered with ID: "${id}"`);
    if (isControlled) {
      setActiveTabId(id);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-8 space-y-8 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Tabs Component Test Bench
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Test interactive keyboard navigation (Arrow keys, Home, End),
          variants, animations, and controlled state management.
        </p>
      </div>

      {/* State & Event Monitor */}
      <div className="p-4 rounded-lg bg-card border border-border shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Tab ID:
          </span>
          <p className="text-sm font-mono text-primary font-medium">
            {isControlled
              ? String(activeTabId)
              : "(Uncontrolled - internal state)"}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Last Action:
          </span>
          <p className="text-sm font-mono text-emerald-500 font-medium">
            {lastChangeEvent}
          </p>
        </div>
        <div className="flex gap-2">
          {processedTabs.map((t) => (
            <button
              key={String(t.id)}
              type="button"
              disabled={t.disabled}
              onClick={() => handleTabChange(t.id)}
              className="px-2 py-1 text-xs font-mono rounded bg-muted hover:bg-muted/80 disabled:opacity-40">
              Force {t.id}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Panel */}
      <div className="p-5 rounded-xl bg-card border border-border shadow-xs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <Text
            as="label"
            className="text-xs font-medium text-muted-foreground">
            State Mode
          </Text>
          <select
            value={isControlled ? "controlled" : "uncontrolled"}
            onChange={(e) => setIsControlled(e.target.value === "controlled")}
            className="w-full p-2 text-xs rounded border border-input bg-background">
            <option value="uncontrolled">Uncontrolled (defaultActiveId)</option>
            <option value="controlled">Controlled (activeId + onChange)</option>
          </select>
        </div>

        <div className="space-y-1">
          <Text
            as="label"
            className="text-xs font-medium text-muted-foreground">
            Variant
          </Text>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as TabsVariant)}
            className="w-full p-2 text-xs rounded border border-input bg-background">
            <option value="underline">underline</option>
            <option value="pills">pills</option>
            <option value="bordered">bordered</option>
            <option value="ghost">ghost</option>
          </select>
        </div>

        <div className="space-y-1">
          <Text
            as="label"
            className="text-xs font-medium text-muted-foreground">
            Size
          </Text>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as TabsSizeKey)}
            className="w-full p-2 text-xs rounded border border-input bg-background">
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </div>

        <div className="space-y-1">
          <Text
            as="label"
            className="text-xs font-medium text-muted-foreground">
            Radius
          </Text>
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value as keyof Radius)}
            className="w-full p-2 text-xs rounded border border-input bg-background">
            <option value="none">none</option>
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
            <option value="xl">xl</option>
            <option value="full">full</option>
          </select>
        </div>

        <div className="flex items-center gap-4 pt-2 col-span-full">
          <Text
            as="label"
            className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={fullWidth}
              onChange={(e) => setFullWidth(e.target.checked)}
              className="rounded text-primary"
            />
            Full Width Stretch
          </Text>

          <Text
            as="label"
            className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={hasIcons}
              onChange={(e) => setHasIcons(e.target.checked)}
              className="rounded text-primary"
            />
            Show Tab Icons
          </Text>

          <Text
            as="label"
            className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={hasBadges}
              onChange={(e) => setHasBadges(e.target.checked)}
              className="rounded text-primary"
            />
            Show Tab Badges
          </Text>
        </div>
      </div>

      {/* ─── LIVE COMPONENT PREVIEW ───────────────────────────────────────── */}
      <div className="p-6 rounded-xl border border-border bg-background shadow-sm space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live Component Stage
        </h2>
        <div className="max-w-3xl">
          <Tabs
            tabs={processedTabs}
            activeId={isControlled ? activeTabId : undefined}
            defaultActiveId="account"
            onChange={handleTabChange}
            variant={variant}
            size={size}
            radius={radius}
            fullWidth={fullWidth}
          />
        </div>
      </div>
    </div>
  );
}
