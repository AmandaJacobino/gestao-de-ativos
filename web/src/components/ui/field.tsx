import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

const inputBase =
  "block w-full h-10 rounded-[6px] border bg-[var(--color-surface)] px-3 text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]/25 focus:border-[var(--color-brand-500)] transition-colors disabled:bg-[var(--color-surface-subtle)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed";

type FieldLabelProps = {
  label: string;
  required?: boolean;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Field({
  label,
  required,
  htmlFor,
  hint,
  error,
  children,
}: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">
        {label}
        {required ? (
          <span className="ml-0.5 text-[var(--color-danger-solid)]">*</span>
        ) : null}
      </span>
      {children}
      {error ? (
        <span className="text-[12px] text-[var(--color-danger-solid)]">
          {error}
        </span>
      ) : hint ? (
        <span className="text-[12px] text-[var(--color-text-muted)]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

type InputProps = ComponentProps<"input"> & {
  mono?: boolean;
  invalid?: boolean;
};

export function Input({ className, mono, invalid, ...rest }: InputProps) {
  return (
    <input
      className={clsx(
        inputBase,
        invalid
          ? "border-[var(--color-danger-solid)]"
          : "border-[var(--color-border)]",
        mono && "font-mono tracking-tight",
        className,
      )}
      {...rest}
    />
  );
}

type SelectProps = ComponentProps<"select"> & { invalid?: boolean };

export function Select({ className, invalid, children, ...rest }: SelectProps) {
  return (
    <select
      className={clsx(
        inputBase,
        "appearance-none pr-9 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b7280%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:16px_16px] bg-no-repeat bg-[right_12px_center]",
        invalid
          ? "border-[var(--color-danger-solid)]"
          : "border-[var(--color-border)]",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
}
