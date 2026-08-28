"use client";

import { Topbar } from "@/components/shell/topbar";
import { StatusPill } from "@/components/ui/status-pill";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useDevices } from "@/lib/devices-store";
import { PackagePlus, Upload, Package } from "lucide-react";

export default function StockPage() {
  const { devices, hydrated } = useDevices();

  return (
    <>
      <Topbar title="Inventory / Stock" />
      <main className="flex-1 overflow-y-auto p-8 bg-[var(--color-surface-subtle)]">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight">
                Stock
              </h2>
              <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
                Devices registered and available for reservation.
              </p>
            </div>
            <div className="flex gap-2">
              <LinkButton
                href="/inventory/stock/import"
                variant="secondary"
                leftIcon={<Upload className="h-4 w-4" strokeWidth={1.75} />}
              >
                Bulk import
              </LinkButton>
              <LinkButton
                href="/inventory/stock/new"
                leftIcon={<PackagePlus className="h-4 w-4" strokeWidth={1.75} />}
              >
                Register new device
              </LinkButton>
            </div>
          </header>

          <section className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
            {!hydrated ? (
              <div className="p-6 text-[13px] text-[var(--color-text-muted)]">
                Loading…
              </div>
            ) : devices.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No devices registered yet"
                description="Register the first device to bootstrap the inventory. You can add one at a time or upload a batch spreadsheet."
                action={
                  <div className="flex gap-2">
                    <LinkButton
                      href="/inventory/stock/new"
                      leftIcon={
                        <PackagePlus className="h-4 w-4" strokeWidth={1.75} />
                      }
                    >
                      Register a device
                    </LinkButton>
                    <LinkButton
                      href="/inventory/stock/import"
                      variant="secondary"
                      leftIcon={
                        <Upload className="h-4 w-4" strokeWidth={1.75} />
                      }
                    >
                      Bulk import
                    </LinkButton>
                  </div>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)]">
                      <Th>Serial</Th>
                      <Th>Type</Th>
                      <Th>Technology</Th>
                      <Th>Purchase NF</Th>
                      <Th>Year</Th>
                      <Th>Status</Th>
                      <Th className="text-right">Registered</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((d) => (
                      <tr
                        key={d.serial}
                        className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors"
                      >
                        <Td mono>{d.serial}</Td>
                        <Td>{d.type}</Td>
                        <Td>{d.technology}</Td>
                        <Td mono>{d.purchaseNfNumber}</Td>
                        <Td>{d.manufacturingYear}</Td>
                        <Td>
                          <StatusPill status={d.status} />
                        </Td>
                        <Td className="text-right text-[var(--color-text-muted)]">
                          {new Date(d.registeredAt).toLocaleDateString()}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {hydrated && devices.length > 0 ? (
            <div className="text-[12px] text-[var(--color-text-muted)] text-right">
              {devices.length} device{devices.length === 1 ? "" : "s"}
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] text-left ${className ?? ""}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  mono,
  className,
}: {
  children: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <td
      className={`px-4 py-3 text-[13px] text-[var(--color-text-primary)] ${
        mono ? "font-mono" : ""
      } ${className ?? ""}`}
    >
      {children}
    </td>
  );
}
