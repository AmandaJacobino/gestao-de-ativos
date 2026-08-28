"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Radio,
  Wrench,
  Truck,
  Send,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavGroup = {
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: NavItem[];
};

const NAV: NavGroup[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Inventory",
    icon: Package,
    children: [
      { label: "Stock", href: "/inventory/stock", icon: Package },
      { label: "Requests", href: "/inventory/requests", icon: ClipboardList },
      { label: "In Field", href: "/inventory/in-field", icon: Radio },
    ],
  },
  {
    label: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
  },
  {
    label: "In Transit",
    icon: Truck,
    children: [
      { label: "Dispatched", href: "/in-transit/dispatched", icon: Send },
      {
        label: "Reverse Logistics",
        href: "/in-transit/reverse",
        icon: RotateCcw,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]"
      style={{ width: "var(--sidebar-width)" }}
    >
      <div className="flex h-14 items-center px-5 border-b border-[var(--color-border)]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-brand-500)] text-white font-semibold">
            L
          </span>
          <span className="font-semibold text-[15px] tracking-tight">
            Lastro
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group) => (
          <SidebarGroup key={group.label} group={group} pathname={pathname} />
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] px-4 py-3">
        <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
          Environment
        </div>
        <div className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">
          MVP — Phase 1
        </div>
      </div>
    </aside>
  );
}

function SidebarGroup({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  if (!group.children) {
    return (
      <SidebarItem
        label={group.label}
        href={group.href!}
        icon={group.icon}
        active={isActive(pathname, group.href!)}
      />
    );
  }

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
        <group.icon className="h-3.5 w-3.5" strokeWidth={2} />
        {group.label}
      </div>
      <div className="mt-1 flex flex-col gap-0.5">
        {group.children.map((child) => (
          <SidebarItem
            key={child.href}
            label={child.label}
            href={child.href}
            icon={child.icon}
            active={isActive(pathname, child.href)}
            nested
          />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  href,
  icon: Icon,
  active,
  nested,
}: {
  label: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] transition-colors",
        nested && "ml-2",
        active
          ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)] font-medium"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]",
      )}
    >
      {active ? (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-[var(--color-brand-500)]" />
      ) : null}
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      {label}
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}
