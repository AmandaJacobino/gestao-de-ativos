"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { useDevices } from "@/lib/devices-store";
import { parseCsv } from "@/lib/csv";
import {
  buildTemplateCsv,
  validateRows,
  type ImportResult,
  type ImportRow,
} from "@/lib/bulk-import";
import {
  ArrowLeft,
  Download,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  RotateCw,
} from "lucide-react";

type Step = "upload" | "preview" | "done";

export default function BulkImportPage() {
  const router = useRouter();
  const { addDevices, serialExists } = useDevices();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imported, setImported] = useState<{
    total: number;
    rejected: number;
  } | null>(null);

  const downloadTemplate = () => {
    const csv = buildTemplateCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lastro-devices-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const onFile = useCallback(
    async (file: File) => {
      setUploadError(null);
      const name = file.name.toLowerCase();
      if (!name.endsWith(".csv")) {
        setUploadError(
          "Unrecognized format. Use a .csv file based on the standard template.",
        );
        return;
      }
      try {
        const text = await file.text();
        const { headers, rows } = parseCsv(text);
        if (rows.length === 0) {
          setUploadError("The file has no data rows.");
          return;
        }
        const parsed = validateRows(headers, rows, serialExists);
        setResult(parsed);
        setFileName(file.name);
        setStep("preview");
      } catch {
        setUploadError("Could not read the file. Try again.");
      }
    },
    [serialExists],
  );

  const onImportConfirmed = () => {
    if (!result) return;
    const valid = result.rows
      .filter((r) => r.errors.length === 0 && r.device)
      .map((r) => r.device!);
    // Re-timestamp so multiple imported devices share close but distinct times
    const now = Date.now();
    const stamped = valid.map((d, idx) => ({
      ...d,
      registeredAt: new Date(now + idx).toISOString(),
    }));
    addDevices(stamped);
    setImported({
      total: stamped.length,
      rejected: result.rows.length - stamped.length,
    });
    setStep("done");
  };

  const reset = () => {
    setResult(null);
    setFileName(null);
    setUploadError(null);
    setImported(null);
    setStep("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Topbar title="Bulk import" />
      <main className="flex-1 overflow-y-auto p-8 bg-[var(--color-surface-subtle)]">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <Link
            href="/inventory/stock"
            className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            Back to Stock
          </Link>

          <header>
            <h2 className="text-[28px] font-semibold tracking-tight">
              Bulk import
            </h2>
            <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
              Upload a CSV based on the standard template. Rows are validated
              before any device is created.
            </p>
          </header>

          <StepIndicator step={step} />

          {step === "upload" ? (
            <UploadStep
              onFile={onFile}
              downloadTemplate={downloadTemplate}
              fileInputRef={fileInputRef}
              error={uploadError}
            />
          ) : null}

          {step === "preview" && result ? (
            <PreviewStep
              result={result}
              fileName={fileName}
              onCancel={reset}
              onConfirm={onImportConfirmed}
            />
          ) : null}

          {step === "done" && imported ? (
            <DoneStep
              imported={imported}
              onImportAnother={reset}
              onGoToStock={() => router.push("/inventory/stock")}
            />
          ) : null}
        </div>
      </main>
    </>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "upload", label: "Upload" },
    { key: "preview", label: "Preview & confirm" },
    { key: "done", label: "Report" },
  ];
  const activeIndex = steps.findIndex((s) => s.key === step);

  return (
    <ol className="flex items-center gap-2">
      {steps.map((s, i) => {
        const state =
          i < activeIndex ? "done" : i === activeIndex ? "active" : "pending";
        return (
          <li key={s.key} className="flex items-center gap-2">
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold"
              style={
                state === "active"
                  ? {
                      background: "var(--color-brand-500)",
                      color: "white",
                    }
                  : state === "done"
                    ? {
                        background: "var(--color-status-operation-bg)",
                        color: "var(--color-status-operation-fg)",
                      }
                    : {
                        background: "var(--color-surface-hover)",
                        color: "var(--color-text-muted)",
                      }
              }
            >
              {i + 1}
            </span>
            <span
              className={`text-[13px] ${
                state === "pending"
                  ? "text-[var(--color-text-muted)]"
                  : "text-[var(--color-text-primary)] font-medium"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 ? (
              <span className="w-8 h-px bg-[var(--color-border)] ml-2" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function UploadStep({
  onFile,
  downloadTemplate,
  fileInputRef,
  error,
}: {
  onFile: (f: File) => void;
  downloadTemplate: () => void;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  error: string | null;
}) {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-semibold">1. Download the template</h3>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">
              Includes the required columns and two example rows. Fill in with
              your batch data before uploading.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={downloadTemplate}
            leftIcon={<Download className="h-4 w-4" strokeWidth={1.75} />}
          >
            Download template
          </Button>
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`bg-[var(--color-surface)] rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
          dragOver
            ? "border-[var(--color-brand-500)] bg-[var(--color-brand-50)]"
            : "border-[var(--color-border-strong)]"
        }`}
      >
        <Upload
          className="h-8 w-8 mx-auto text-[var(--color-text-muted)] mb-3"
          strokeWidth={1.5}
        />
        <div className="text-[15px] font-medium">
          Drop your CSV file here, or
        </div>
        <div className="mt-3">
          <label className="inline-flex">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />
            <span className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-[var(--color-border-strong)] text-[13px] font-medium hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors">
              Choose a file
            </span>
          </label>
        </div>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-3">
          Accepts .csv up to 5 MB.
        </p>
      </div>

      {error ? (
        <div className="flex items-start gap-2.5 rounded-md border border-[var(--color-danger-bg)] bg-[var(--color-danger-bg)] p-3">
          <AlertTriangle
            className="h-4 w-4 mt-0.5 text-[var(--color-danger-solid)] shrink-0"
            strokeWidth={2}
          />
          <div className="text-[13px] text-[var(--color-danger-fg)]">{error}</div>
        </div>
      ) : null}
    </section>
  );
}

function PreviewStep({
  result,
  fileName,
  onCancel,
  onConfirm,
}: {
  result: ImportResult;
  fileName: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const stats = useMemo(() => {
    const total = result.rows.length;
    const valid = result.rows.filter((r) => r.errors.length === 0).length;
    const duplicates = result.rows.filter((r) => r.duplicate).length;
    const invalid = total - valid;
    return { total, valid, invalid, duplicates };
  }, [result]);

  return (
    <section className="flex flex-col gap-4">
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-4 flex items-center gap-3">
        <FileText
          className="h-5 w-5 text-[var(--color-text-muted)]"
          strokeWidth={1.5}
        />
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium truncate">{fileName}</div>
          <div className="text-[12px] text-[var(--color-text-muted)]">
            {stats.total} row{stats.total === 1 ? "" : "s"} in the file
          </div>
        </div>
      </div>

      {result.headerErrors.length > 0 ? (
        <div className="flex items-start gap-2.5 rounded-md border border-[var(--color-danger-bg)] bg-[var(--color-danger-bg)] p-3">
          <AlertTriangle
            className="h-4 w-4 mt-0.5 text-[var(--color-danger-solid)] shrink-0"
            strokeWidth={2}
          />
          <div className="text-[13px] text-[var(--color-danger-fg)]">
            {result.headerErrors.join(" · ")}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        <StatChip
          label="Valid"
          value={stats.valid}
          tone="operation"
          icon={<CheckCircle2 className="h-4 w-4" strokeWidth={2} />}
        />
        <StatChip
          label="Duplicates"
          value={stats.duplicates}
          tone="stock"
          icon={<AlertTriangle className="h-4 w-4" strokeWidth={2} />}
        />
        <StatChip
          label="Invalid"
          value={stats.invalid}
          tone="maintenance"
          icon={<X className="h-4 w-4" strokeWidth={2} />}
        />
      </div>

      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)]">
                <Th>Row</Th>
                <Th>Serial</Th>
                <Th>Type</Th>
                <Th>Purchase NF</Th>
                <Th>Year</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((r) => (
                <RowPreview key={r.rowNumber} row={r} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="text-[13px] text-[var(--color-text-secondary)]">
          {stats.valid} of {stats.total} row{stats.total === 1 ? "" : "s"} will
          be imported. Invalid rows are ignored.
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={stats.valid === 0}>
            Import {stats.valid} device{stats.valid === 1 ? "" : "s"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function RowPreview({ row }: { row: ImportRow }) {
  const isValid = row.errors.length === 0;
  const isDup = row.duplicate;
  const rowBg = isDup
    ? "bg-[var(--color-status-stock-bg)]/40"
    : !isValid
      ? "bg-[var(--color-danger-bg)]/40"
      : "";

  return (
    <>
      <tr
        className={`border-b border-[var(--color-border)] last:border-b-0 ${rowBg}`}
      >
        <Td className="text-[var(--color-text-muted)] tabular-nums">
          {row.rowNumber}
        </Td>
        <Td mono>{row.raw.serial || "—"}</Td>
        <Td>{row.raw.type || "—"}</Td>
        <Td mono>{row.raw.purchaseNfNumber || "—"}</Td>
        <Td>{row.raw.manufacturingYear || "—"}</Td>
        <Td>
          {isValid ? (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-status-operation-fg)]">
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
              Valid
            </span>
          ) : isDup ? (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-status-stock-fg)]">
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} />
              Duplicate
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-danger-fg)]">
              <X className="h-3.5 w-3.5" strokeWidth={2} />
              Invalid
            </span>
          )}
        </Td>
      </tr>
      {!isValid ? (
        <tr className={rowBg}>
          <td
            colSpan={6}
            className="px-4 pb-3 text-[12px] text-[var(--color-text-secondary)]"
          >
            <div className="pl-8">
              {row.errors.map((err, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[var(--color-danger-solid)]">•</span>
                  {err}
                </div>
              ))}
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

function DoneStep({
  imported,
  onImportAnother,
  onGoToStock,
}: {
  imported: { total: number; rejected: number };
  onImportAnother: () => void;
  onGoToStock: () => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6 flex items-start gap-4">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--color-status-operation-bg)" }}
        >
          <CheckCircle2
            className="h-5 w-5"
            style={{ color: "var(--color-status-operation-solid)" }}
            strokeWidth={2}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold">Import complete</h3>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
            {imported.total} device{imported.total === 1 ? "" : "s"} added to
            stock.{" "}
            {imported.rejected > 0
              ? `${imported.rejected} row${
                  imported.rejected === 1 ? " was" : "s were"
                } skipped (invalid or duplicate).`
              : "No rows were skipped."}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          onClick={onImportAnother}
          leftIcon={<RotateCw className="h-4 w-4" strokeWidth={1.75} />}
        >
          Import another file
        </Button>
        <Button onClick={onGoToStock}>Go to Stock</Button>
      </div>
    </section>
  );
}

function StatChip({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone: "operation" | "stock" | "maintenance";
  icon: React.ReactNode;
}) {
  const bg = `var(--color-status-${tone}-bg)`;
  const fg = `var(--color-status-${tone}-fg)`;
  return (
    <div
      className="rounded-md p-3 flex items-center gap-3"
      style={{ background: bg, color: fg }}
    >
      <span className="h-8 w-8 rounded-full bg-white/40 flex items-center justify-center">
        {icon}
      </span>
      <div>
        <div className="text-[11px] uppercase tracking-wider opacity-80">
          {label}
        </div>
        <div className="text-[18px] font-semibold tabular-nums">{value}</div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] text-left">
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
      className={`px-4 py-2.5 text-[13px] text-[var(--color-text-primary)] ${
        mono ? "font-mono" : ""
      } ${className ?? ""}`}
    >
      {children}
    </td>
  );
}
