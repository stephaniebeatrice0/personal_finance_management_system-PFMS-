"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon,
  ArrowDataTransferHorizontalIcon,
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
  Cancel01Icon,
  DashboardSquare01Icon,
  Menu01Icon,
  PieChartIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import type { User } from "@/lib/types";
import { UserMenu } from "@/components/user-menu";

const MAIN_NAV = [
  { href: "/dashboard", label: "Overview", icon: DashboardSquare01Icon },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
    icon: ArrowDataTransferHorizontalIcon,
  },
  { href: "/dashboard/budgets", label: "Budgets", icon: PieChartIcon },
  { href: "/dashboard/reports", label: "Reports", icon: Analytics01Icon },
];
const SETTINGS = {
  href: "/dashboard/settings",
  label: "Settings",
  icon: Settings02Icon,
};
const STORAGE_KEY = "mm.sidebar";

const NAV_BG = "bg-[var(--accent-4)]";
const PANEL_SHADOW =
  "shadow-[0_8px_30px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.05)]";

type NavEntry = (typeof MAIN_NAV)[number];

function NavItem({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavEntry;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      className={[
        "group flex items-center gap-4 rounded-2xl px-4 py-3 text-[15px] text-black",
        "transition-all duration-150 motion-reduce:transition-none",
        "hover:bg-white hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30",
        collapsed ? "justify-center px-0" : "",
        active
          ? "bg-white font-semibold shadow-[0_2px_10px_rgba(15,23,42,0.12)]"
          : "font-medium",
      ].join(" ")}
    >
      <HugeiconsIcon
        icon={item.icon}
        size={22}
        strokeWidth={active ? 2 : 1.6}
        className="shrink-0"
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
  return collapsed ? (
    <Tooltip content={item.label} side="right">
      {link}
    </Tooltip>
  ) : (
    link
  );
}

function NavList({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  const render = (item: NavEntry) => (
    <NavItem
      key={item.href}
      item={item}
      active={isActive(item.href)}
      collapsed={collapsed}
      onNavigate={onNavigate}
    />
  );
  return (
    <nav aria-label="Main" className="flex flex-1 flex-col gap-2 px-4 py-6">
      {MAIN_NAV.map(render)}
      <div className="mt-auto border-t border-black/10 pt-4">
        {render(SETTINGS)}
      </div>
    </nav>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href="/dashboard"
      aria-label="Money Manager home"
      className={`flex h-20 shrink-0 items-center border-b border-black/10 text-black ${
        collapsed ? "justify-center" : "px-8"
      }`}
    >
      <span className="text-xl font-bold tracking-tight">
        {collapsed ? "MM" : "Money Manager"}
      </span>
    </Link>
  );
}

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "collapsed");
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, next ? "collapsed" : "open");
  };

  return (
    <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
      <div className="flex min-h-screen">
        {/* Desktop sidebar: floating rounded panel */}
        <aside
          className={`sticky top-4 m-4 mr-0 hidden h-[calc(100vh-2rem)] shrink-0 flex-col overflow-hidden rounded-3xl ${NAV_BG} ${PANEL_SHADOW} transition-[width] duration-200 motion-reduce:transition-none md:flex`}
          style={{ width: collapsed ? 88 : 288 }}
        >
          <Brand collapsed={collapsed} />
          <NavList collapsed={collapsed} />
        </aside>

        {/* Mobile drawer (rendered in place, not portalled, so it keeps the Radix theme variables) */}
        <Dialog.Overlay className="mm-overlay fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className={`mm-drawer fixed inset-y-3 left-3 z-50 flex w-80 max-w-[85vw] flex-col overflow-hidden rounded-3xl ${NAV_BG} shadow-2xl outline-none`}
        >
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <div className="flex items-center justify-between border-b border-black/10 pr-4">
            <Brand collapsed={false} />
            <Dialog.Close asChild>
              <IconButton
                variant="ghost"
                color="gray"
                highContrast
                size="3"
                radius="full"
                aria-label="Close navigation"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} />
              </IconButton>
            </Dialog.Close>
          </div>
          <NavList collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </Dialog.Content>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Floating header, dropped lower from the top edge */}
          <header
            className={`sticky top-4 z-30 mx-4 mt-4 flex h-20 items-center justify-between rounded-2xl bg-[var(--color-panel-solid)] px-4 sm:px-6 ${PANEL_SHADOW}`}
          >
            <div>
              <span className="md:hidden">
                <Dialog.Trigger asChild>
                  <IconButton
                    variant="ghost"
                    color="gray"
                    highContrast
                    size="3"
                    radius="full"
                    aria-label="Open navigation"
                  >
                    <HugeiconsIcon icon={Menu01Icon} size={22} />
                  </IconButton>
                </Dialog.Trigger>
              </span>
              <span className="hidden md:inline-flex">
                <IconButton
                  variant="ghost"
                  color="gray"
                  highContrast
                  size="3"
                  radius="full"
                  onClick={toggle}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  aria-expanded={!collapsed}
                >
                  <HugeiconsIcon
                    icon={
                      collapsed ? ArrowRightDoubleIcon : ArrowLeftDoubleIcon
                    }
                    size={20}
                  />
                </IconButton>
              </span>
            </div>
            <UserMenu user={user} />
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </Dialog.Root>
  );
}
