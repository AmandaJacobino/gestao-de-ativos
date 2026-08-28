"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { useDevices } from "@/lib/devices-store";
import type {
  Device,
  DeviceType,
  Supplier,
  Technology,
} from "@/lib/types";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const DEVICE_TYPES: DeviceType[] = [
  "Prism",
  "Nexus",
  "Fusion",
  "DataHub FlowTrack",
];
const TECHNOLOGIES: Technology[] = ["CAT1 Bis", "NB-IoT"];
const SUPPLIERS: Supplier[] = ["Board", "Sensor", "Complete Assembly"];

type FormState = {
  purchaseNfNumber: string;
  nfIssueDate: string;
  serial: string;
  type: DeviceType | "";
  technology: Technology | "";
  supplier: Supplier | "";
  manufacturingYear: string;
  imei: string;
  iccid: string;
};

const INITIAL: FormState = {
  purchaseNfNumber: "",
  nfIssueDate: "",
  serial: "",
  type: "",
  technology: "",
  supplier: "",
  manufacturingYear: "",
  imei: "",
  iccid: "",
};

export default function NewDevicePage() {
  const router = useRouter();
  const { addDevice, serialExists } = useDevices();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [savedSerial, setSavedSerial] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (savedSerial) setSavedSerial(null);
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.purchaseNfNumber.trim())
      next.purchaseNfNumber = "Purchase NF Number is required.";
    if (!form.nfIssueDate.trim())
      next.nfIssueDate = "NF Issue Date is required.";
    if (!form.serial.trim()) next.serial = "Serial Number is required.";
    else if (serialExists(form.serial))
      next.serial =
        "A device with this serial already exists in the system.";
    if (!form.type) next.type = "Select a device type.";
    if (!form.technology) next.technology = "Select a technology.";
    if (!form.supplier) next.supplier = "Select a supplier.";
    const year = Number(form.manufacturingYear);
    if (!form.manufacturingYear.trim())
      next.manufacturingYear = "Manufacturing Year is required.";
    else if (!Number.isInteger(year) || year < 2000 || year > 2100)
      next.manufacturingYear = "Enter a valid year (2000–2100).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const device: Device = {
      serial: form.serial.trim(),
      purchaseNfNumber: form.purchaseNfNumber.trim(),
      nfIssueDate: form.nfIssueDate,
      type: form.type as DeviceType,
      technology: form.technology as Technology,
      supplier: form.supplier as Supplier,
      manufacturingYear: Number(form.manufacturingYear),
      imei: form.imei.trim() || undefined,
      iccid: form.iccid.trim() || undefined,
      status: "in-stock",
      registeredAt: new Date().toISOString(),
      maintenanceCount: 0,
    };

    addDevice(device);
    setSavedSerial(device.serial);
    setForm(INITIAL);
  };

  return (
    <>
      <Topbar title="Register new device" />
      <main className="flex-1 overflow-y-auto p-8 bg-[var(--color-surface-subtle)]">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <Link
            href="/inventory/stock"
            className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            Back to Stock
          </Link>

          <header>
            <h2 className="text-[28px] font-semibold tracking-tight">
              Register new device
            </h2>
            <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
              Fill in the fields below. The device will be created with status{" "}
              <span className="font-medium text-[var(--color-status-stock-fg)]">
                In Stock
              </span>
              .
            </p>
          </header>

          {savedSerial ? (
            <div className="flex items-start gap-3 rounded-lg border border-[var(--color-status-operation-bg)] bg-[var(--color-status-operation-bg)] p-4">
              <CheckCircle2
                className="h-5 w-5 mt-0.5 shrink-0"
                style={{ color: "var(--color-status-operation-solid)" }}
                strokeWidth={2}
              />
              <div className="flex-1">
                <div className="text-[14px] font-medium text-[var(--color-status-operation-fg)]">
                  Device registered
                </div>
                <div className="text-[13px] text-[var(--color-status-operation-fg)] mt-0.5">
                  Serial{" "}
                  <span className="font-mono font-semibold">{savedSerial}</span>{" "}
                  is now in stock. You can register another one or return to the
                  stock list.
                </div>
              </div>
            </div>
          ) : null}

          <form
            onSubmit={onSubmit}
            className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6 flex flex-col gap-6"
          >
            <FormSection
              title="Purchase invoice"
              description="Required — cannot be left blank."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Purchase NF Number"
                  required
                  error={errors.purchaseNfNumber}
                >
                  <Input
                    mono
                    placeholder="e.g. 000123456"
                    value={form.purchaseNfNumber}
                    onChange={(e) => set("purchaseNfNumber", e.target.value)}
                    invalid={!!errors.purchaseNfNumber}
                  />
                </Field>
                <Field
                  label="NF Issue Date"
                  required
                  error={errors.nfIssueDate}
                >
                  <Input
                    type="date"
                    value={form.nfIssueDate}
                    onChange={(e) => set("nfIssueDate", e.target.value)}
                    invalid={!!errors.nfIssueDate}
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Device identity">
              <Field
                label="Serial Number"
                required
                error={errors.serial}
                hint="Primary key — must be unique."
              >
                <Input
                  mono
                  placeholder="e.g. NVT-45205"
                  value={form.serial}
                  onChange={(e) => set("serial", e.target.value)}
                  invalid={!!errors.serial}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Type" required error={errors.type}>
                  <Select
                    value={form.type}
                    onChange={(e) => set("type", e.target.value as DeviceType)}
                    invalid={!!errors.type}
                  >
                    <option value="">Select a type…</option>
                    {DEVICE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field
                  label="Technology"
                  required
                  error={errors.technology}
                >
                  <Select
                    value={form.technology}
                    onChange={(e) =>
                      set("technology", e.target.value as Technology)
                    }
                    invalid={!!errors.technology}
                  >
                    <option value="">Select a technology…</option>
                    {TECHNOLOGIES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Supplier" required error={errors.supplier}>
                  <Select
                    value={form.supplier}
                    onChange={(e) => set("supplier", e.target.value as Supplier)}
                    invalid={!!errors.supplier}
                  >
                    <option value="">Select a supplier…</option>
                    {SUPPLIERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field
                  label="Manufacturing Year"
                  required
                  error={errors.manufacturingYear}
                >
                  <Input
                    inputMode="numeric"
                    placeholder="e.g. 2024"
                    value={form.manufacturingYear}
                    onChange={(e) =>
                      set("manufacturingYear", e.target.value)
                    }
                    invalid={!!errors.manufacturingYear}
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection
              title="Connectivity (optional)"
              description="Fill in if the SIM identifiers are known."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="IMEI Number">
                  <Input
                    mono
                    placeholder="15 digits"
                    value={form.imei}
                    onChange={(e) => set("imei", e.target.value)}
                  />
                </Field>
                <Field label="ICCID Number">
                  <Input
                    mono
                    placeholder="19–20 digits"
                    value={form.iccid}
                    onChange={(e) => set("iccid", e.target.value)}
                  />
                </Field>
              </div>
            </FormSection>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--color-border)]">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/inventory/stock")}
              >
                Cancel
              </Button>
              <Button type="submit">Register device</Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
          {title}
        </h3>
        {description ? (
          <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
