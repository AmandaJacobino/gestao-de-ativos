import type { DeviceStatus } from "@/lib/types";
import { STATUS_LABEL, STATUS_TOKEN } from "@/lib/status";

export function StatusPill({ status }: { status: DeviceStatus }) {
  const token = STATUS_TOKEN[status];
  const label = STATUS_LABEL[status];
  const bg = `var(--color-status-${token}-bg)`;
  const fg = `var(--color-status-${token}-fg)`;
  const dot = `var(--color-status-${token}-solid)`;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider"
      style={{ background: bg, color: fg }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: dot }}
        aria-hidden
      />
      {label}
    </span>
  );
}
