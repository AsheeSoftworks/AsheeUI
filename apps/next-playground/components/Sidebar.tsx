"use client";

import { Sidebar, type SidebarItem, ToastProvider, useTheme } from "asheeui";
import { useState } from "react";

// Test Pages
import CarouselDemoPage from "./pages/CarouselDemo";
import ConfigTestPage from "./pages/ConfigTestPage";
import KeyboardDemoPage from "./pages/KeyboardDemoPage";
import LocalPropsTestPage from "./pages/LocalPropsTestPage";
import MarqueeDemoPage from "./pages/MarqueeDemoPage";
import ResizableScreenTestPage from "./pages/ResizableScreenTestPage";
import TableDemo from "./pages/TableDemo";
import TabsTestPage from "./pages/TabsTestPage";
import ToastTestPage from "./pages/ToastTestPage";
import TooltipTestPage from "./pages/TooltipTestPage";

// ─── Types & Sidebar Navigation Items ─────────────────────────────────────────

type PageKey =
  | "globals"
  | "local"
  | "table"
  | "tooltip"
  | "toast"
  | "tabs"
  | "resize"
  | "keyboard"
  | "carousel"
  | "marquee";

const navItems: SidebarItem<PageKey>[] = [
  {
    id: "globals",
    label: "Globals Only",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    id: "local",
    label: "Local Only",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
  },
  {
    id: "table",
    label: "Table Demo",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: "tooltip",
    label: "Tooltip Demo",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    id: "toast",
    label: "Toast Demo",
    badge: (
      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary rounded-full">
        New
      </span>
    ),
    icon: (
      <svg
        className="w-5 h-5"
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
  },
  {
    id: "tabs",
    label: "Tabs Demo",
    badge: (
      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary rounded-full">
        New
      </span>
    ),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    id: "resize",
    label: "Resize Screen Demo",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 8V4m0 0h4M4 4l5 5m11-2V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
    ),
  },
  {
    id: "keyboard",
    label: "Keyboard Demo",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
  },
  {
    id: "carousel",
    label: "Carousel Demo",
    badge: (
      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary rounded-full">
        New
      </span>
    ),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: "marquee",
    label: "Marquee Demo",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

// ─── Main Application Component ───────────────────────────────────────────────

export function AppContent() {
  const [page, setPage] = useState<PageKey>("toast");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setTheme } = useTheme();

  function renderPage() {
    switch (page) {
      case "globals":
        return <ConfigTestPage />;
      case "local":
        return <LocalPropsTestPage />;
      case "table":
        return <TableDemo />;
      case "tooltip":
        return <TooltipTestPage />;
      case "toast":
        return <ToastTestPage />;
      case "tabs":
        return <TabsTestPage />;
      case "resize":
        return <ResizableScreenTestPage />;
      case "keyboard":
        return <KeyboardDemoPage />;
      case "carousel":
        return <CarouselDemoPage />;
      case "marquee":
        return <MarqueeDemoPage />;
      default:
        return <ConfigTestPage />;
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-y-hidden bg-background text-foreground">
      {/* Sidebar Component */}
      <Sidebar<PageKey>
        title="Test Suite"
        items={navItems}
        activeKey={page}
        isCollapsed={isCollapsed}
        onSelect={(item) => setPage(item.id)}
        onBack={() => setIsCollapsed((prev) => !prev)}
        size="md"
        footer={
          <button
            type="button"
            // onClick={() => setIsCollapsed((prev) => !prev)}
            onClick={() => setTheme("company-red")}
            className="w-full flex items-center justify-center p-2 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted rounded-md transition-colors">
            {isCollapsed ? "Expand" : "Collapse Sidebar"}
          </button>
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto">{renderPage()}</main>
    </div>
  );
}

export default function SideBar() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
