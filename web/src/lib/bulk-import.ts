import type { Device, DeviceType, Supplier, Technology } from "./types";

const DEVICE_TYPES: DeviceType[] = [
  "Prism",
  "Nexus",
  "Fusion",
  "DataHub FlowTrack",
];
const TECHNOLOGIES: Technology[] = ["CAT1 Bis", "NB-IoT"];
const SUPPLIERS: Supplier[] = ["Board", "Sensor", "Complete Assembly"];

export const TEMPLATE_HEADERS = [
  "purchaseNfNumber",
  "nfIssueDate",
  "serial",
  "type",
  "technology",
  "supplier",
  "manufacturingYear",
  "imei",
  "iccid",
] as const;

export type ImportRowRaw = Record<(typeof TEMPLATE_HEADERS)[number], string>;

export type ImportRow = {
  rowNumber: number; // 1-based, matches spreadsheet line
  raw: ImportRowRaw;
  errors: string[];
  duplicate: boolean; // duplicate against existing devices or within this file
  device?: Device;
};

export type ImportResult = {
  headers: string[];
  rows: ImportRow[];
  headerErrors: string[];
};

const TEMPLATE_EXAMPLE_ROWS: string[][] = [
  [
    "000123456",
    "2025-11-10",
    "NVT-45205",
    "Prism",
    "CAT1 Bis",
    "Complete Assembly",
    "2024",
    "",
    "",
  ],
  [
    "000123456",
    "2025-11-10",
    "NVT-45206",
    "Nexus",
    "NB-IoT",
    "Board",
    "2024",
    "356938035643809",
    "8955101234567890120",
  ],
];

export function buildTemplateCsv(): string {
  const header = TEMPLATE_HEADERS.join(",");
  const examples = TEMPLATE_EXAMPLE_ROWS.map((r) => r.join(","));
  return [header, ...examples].join("\r\n");
}

function isValidDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  return !isNaN(d.getTime());
}

export function validateRows(
  headers: string[],
  rows: string[][],
  existingSerialExists: (serial: string) => boolean,
): ImportResult {
  const headerErrors: string[] = [];
  const normalized = headers.map((h) => h.trim());
  const missing = TEMPLATE_HEADERS.filter((h) => !normalized.includes(h));
  if (missing.length > 0) {
    headerErrors.push(`Missing columns: ${missing.join(", ")}`);
  }

  const indexOf = (name: string) => normalized.indexOf(name);

  const seenInFile = new Set<string>();
  const parsed: ImportRow[] = rows.map((cells, i) => {
    const rowNumber = i + 2; // header is row 1
    const get = (h: (typeof TEMPLATE_HEADERS)[number]) => {
      const idx = indexOf(h);
      return idx >= 0 ? (cells[idx] ?? "").trim() : "";
    };

    const raw: ImportRowRaw = {
      purchaseNfNumber: get("purchaseNfNumber"),
      nfIssueDate: get("nfIssueDate"),
      serial: get("serial"),
      type: get("type"),
      technology: get("technology"),
      supplier: get("supplier"),
      manufacturingYear: get("manufacturingYear"),
      imei: get("imei"),
      iccid: get("iccid"),
    };

    const errors: string[] = [];
    if (!raw.purchaseNfNumber) errors.push("Purchase NF Number is required");
    if (!raw.nfIssueDate) errors.push("NF Issue Date is required");
    else if (!isValidDate(raw.nfIssueDate))
      errors.push("NF Issue Date must be YYYY-MM-DD");
    if (!raw.serial) errors.push("Serial is required");
    if (!DEVICE_TYPES.includes(raw.type as DeviceType))
      errors.push(`Type must be one of: ${DEVICE_TYPES.join(" | ")}`);
    if (!TECHNOLOGIES.includes(raw.technology as Technology))
      errors.push(`Technology must be one of: ${TECHNOLOGIES.join(" | ")}`);
    if (!SUPPLIERS.includes(raw.supplier as Supplier))
      errors.push(`Supplier must be one of: ${SUPPLIERS.join(" | ")}`);
    const year = Number(raw.manufacturingYear);
    if (!raw.manufacturingYear) errors.push("Manufacturing Year is required");
    else if (!Number.isInteger(year) || year < 2000 || year > 2100)
      errors.push("Manufacturing Year must be a valid year (2000–2100)");

    let duplicate = false;
    if (raw.serial) {
      const key = raw.serial.toLowerCase();
      if (existingSerialExists(raw.serial)) {
        duplicate = true;
        errors.push("Serial already exists in the system");
      }
      if (seenInFile.has(key)) {
        duplicate = true;
        errors.push("Serial appears more than once in the file");
      }
      seenInFile.add(key);
    }

    const valid = errors.length === 0;
    const device: Device | undefined = valid
      ? {
          serial: raw.serial,
          purchaseNfNumber: raw.purchaseNfNumber,
          nfIssueDate: raw.nfIssueDate,
          type: raw.type as DeviceType,
          technology: raw.technology as Technology,
          supplier: raw.supplier as Supplier,
          manufacturingYear: year,
          imei: raw.imei || undefined,
          iccid: raw.iccid || undefined,
          status: "in-stock",
          registeredAt: new Date().toISOString(),
          maintenanceCount: 0,
        }
      : undefined;

    return { rowNumber, raw, errors, duplicate, device };
  });

  return { headers: normalized, rows: parsed, headerErrors };
}
