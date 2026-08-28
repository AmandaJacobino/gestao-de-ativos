import { Bell, Search } from "lucide-react";

export function Topbar({ title }: { title?: string }) {
  return (
    <header
      className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6"
      style={{ height: "var(--topbar-height)" }}
    >
      <div className="flex items-center gap-3">
        {title ? (
          <h1 className="text-[15px] font-medium text-[var(--color-text-primary)]">
            {title}
          </h1>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]"
            strokeWidth={1.75}
          />
          <input
            type="search"
            placeholder="Search serial, NF number..."
            className="h-9 w-72 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-subtle)] pl-9 pr-3 text-[13px] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]/25 focus:border-[var(--color-brand-500)] focus:bg-[var(--color-surface)]"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <div className="ml-2 flex items-center gap-2 pl-3 border-l border-[var(--color-border)]">
          <div className="h-8 w-8 rounded-full bg-[var(--color-brand-100)] flex items-center justify-center text-[13px] font-semibold text-[var(--color-brand-700)]">
            AJ
          </div>
          <div className="hidden lg:flex flex-col leading-tight">
            <span className="text-[13px] font-medium">Amanda J.</span>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              Operations
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
