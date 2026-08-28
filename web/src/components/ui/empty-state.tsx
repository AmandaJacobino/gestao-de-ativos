import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="rounded-full bg-[var(--color-surface-subtle)] p-3 mb-4">
        <Icon className="h-8 w-8 text-[var(--color-neutral-400)]" strokeWidth={1.5} />
      </div>
      <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      {description ? (
        <p className="text-[14px] text-[var(--color-text-secondary)] max-w-sm mb-6">
          {description}
        </p>
      ) : null}
      {action}
    </div>
  );
}
