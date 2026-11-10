"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IconButton, Tooltip } from "@radix-ui/themes";
import {
  BarChartIcon,
  Cross1Icon,
  DashboardIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  GearIcon,
  HamburgerMenuIcon,
  ListBulletIcon,
  PieChartIcon,
} from "@radix-ui/react-icons";
import type { User } from "@/lib/types";
import { UserMenu } from "@/components/user-menu";

const MAIN_NAV = [
  { href: "/dashboard", label: "Overview", icon: DashboardIcon },
  { href: "/dashboard/transactions", label: "Transactions", icon: ListBulletIcon },
  { href: "/dashboard/budgets", label: "Budgets", icon: PieChartIcon },
  { href: "/dashboard/reports", label: "Reports", icon: BarChartIcon },
];
const SETTINGS = { href: "/dashboard/settings", label: "Settings", icon: GearIcon };
const STORAGE_KEY = "mm.sidebar";

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
  const Icon = item.icon;
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      className={[
        "flex items-center gap-3 rounded-md px-3 py-2 text-base transition-colors",
        collapsed ? "justify-center" : "",
        active
          ? "bg-[var(--accent-a3)] font-bold text-[var(--accent-11)]"
          : "text-[var(--gray-11)] hover:bg-[var(--gray-a3)] hover:text-[var(--gray-12)]",
      ].join(" ")}
    >
      <Icon width={18} height={18} className="shrink-0" />
      {!collapsed && <span>{item.label}</span>}
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

function NavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));
  const render = (item: NavEntry) => (
    <NavItem key={item.href} item={item} active={isActive(item.href)} collapsed={collapsed} onNavigate={onNavigate} />
  );
  return (
    <nav aria-label="Main" className="flex flex-1 flex-col gap-1 px-2 py-3">
      {MAIN_NAV.map(render)}
      <div className="mt-auto">{render(SETTINGS)}</div>
    </nav>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href="/dashboard"
      aria-label="Money Manager home"
      className={`flex h-14 shrink-0 items-center border-b border-[var(--gray-a5)] ${collapsed ? "justify-center" : "px-5"}`}
    >
      <span className="text-xl font-bold tracking-tight">{collapsed ? "MM" : "Money Manager"}</span>
    </Link>
  );
}

export function AppShell({ user, children }: { user: User; children: React.ReactNode }) {
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
        {/* Desktop sidebar */}
        <aside
          className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[var(--gray-a5)] bg-[var(--color-panel-solid)] transition-[width] duration-200 motion-reduce:transition-none md:flex"
          style={{ width: collapsed ? 68 : 244 }}
        >
          <Brand collapsed={collapsed} />
          <NavList collapsed={collapsed} />
        </aside>

        {/* Mobile drawer (rendered in place, not portalled, so it keeps the Radix theme variables) */}
        <Dialog.Overlay className="mm-overlay fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="mm-drawer fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-[var(--color-panel-solid)] shadow-xl outline-none"
        >
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <div className="flex items-center justify-between border-b border-[var(--gray-a5)] pr-3">
            <Brand collapsed={false} />
            <Dialog.Close asChild>
              <IconButton variant="ghost" color="gray" aria-label="Close navigation">
                <Cross1Icon />
              </IconButton>
            </Dialog.Close>
          </div>
          <NavList collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </Dialog.Content>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--gray-a5)] bg-[var(--color-panel-solid)] px-3 sm:px-5">
            <div>
              <span className="md:hidden">
                <Dialog.Trigger asChild>
                  <IconButton variant="ghost" color="gray" aria-label="Open navigation">
                    <HamburgerMenuIcon width={18} height={18} />
                  </IconButton>
                </Dialog.Trigger>
              </span>
              <span className="hidden md:inline-flex">
                <IconButton
                  variant="ghost"
                  color="gray"
                  onClick={toggle}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  aria-expanded={!collapsed}
                >
                  {collapsed ? <DoubleArrowRightIcon width={18} height={18} /> : <DoubleArrowLeftIcon width={18} height={18} />}
                </IconButton>
              </span>
            </div>
            <UserMenu user={user} />
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
        </div>
      </div>
    </Dialog.Root>
  );
}
