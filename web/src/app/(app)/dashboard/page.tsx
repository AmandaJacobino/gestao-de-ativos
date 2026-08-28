"use client";

import { Topbar } from "@/components/shell/topbar";
import { useDevices } from "@/lib/devices-store";
import { STATUS_LABEL } from "@/lib/status";
import { LinkButton } from "@/components/ui/button";
import { Package, PlusCircle, Upload } from "lucide-react";

export default function DashboardPage() {
  const { devices, hydrated } = useDevices();

  const total = devices.length;
  const byStatus = devices.reduce<Record<string, number>>((acc, d) => {
    acc[d.status] = (acc[d.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Topbar title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-8 bg-[var(--color-surface-subtle)]">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <section>
            <h2 className="text-[28px] font-semibold tracking-tight">
              Fleet overview
            </h2>
            <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
              A single source of truth for every device Novus Tech owns.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Total devices"
              value={hydrated ? total : "—"}
              hint="Across all lifecycle states"
            />
            <StatCard
              label="In Stock"
              value={hydrated ? byStatus["in-stock"] ?? 0 : "—"}
              hint="Available for reservation"
            />
            <StatCard
              label="In Operation"
              value={hydrated ? byStatus["in-operation"] ?? 0 : "—"}
              hint="Deployed and communicating"
            />
          </section>

          <section className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[18px] font-semibold">Get started</h3>
                <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">
                  Register the first devices to bootstrap the inventory.
                </p>
              </div>
              <Package
                className="h-6 w-6 text-[var(--color-text-muted)]"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton
                href="/inventory/stock/new"
                leftIcon={<PlusCircle className="h-4 w-4" strokeWidth={1.75} />}
              >
                Register a device
              </LinkButton>
              <LinkButton
                href="/inventory/stock/import"
                variant="secondary"
                leftIcon={<Upload className="h-4 w-4" strokeWidth={1.75} />}
              >
                Bulk import
              </LinkButton>
            </div>
          </section>

          {hydrated && total > 0 ? (
            <section className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
              <h3 className="text-[18px] font-semibold mb-4">By status</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(byStatus).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between p-3 rounded-md bg-[var(--color-surface-subtle)]"
                  >
                    <span className="text-[13px] text-[var(--color-text-secondary)]">
                      {STATUS_LABEL[status as keyof typeof STATUS_LABEL]}
                    </span>
                    <span className="font-mono text-[15px] font-semibold">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-5">
      <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </div>
      <div className="mt-2 text-[36px] font-semibold tracking-tight tabular-nums">
        {value}
      </div>
      {hint ? (
        <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">
          {hint}
        </div>
      ) : null}
    </div>
  );
}
