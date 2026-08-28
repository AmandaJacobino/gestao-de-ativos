export type DeviceType = "Prism" | "Nexus" | "Fusion" | "DataHub FlowTrack";
export type Technology = "CAT1 Bis" | "NB-IoT";
export type Supplier = "Board" | "Sensor" | "Complete Assembly";

export type DeviceStatus =
  | "in-stock"
  | "reserved"
  | "in-picking"
  | "in-transit"
  | "delivered"
  | "in-operation"
  | "field-failure"
  | "awaiting-return-invoice"
  | "in-maintenance"
  | "disposed";

export type Device = {
  serial: string;
  purchaseNfNumber: string;
  nfIssueDate: string; // ISO YYYY-MM-DD
  type: DeviceType;
  technology: Technology;
  supplier: Supplier;
  manufacturingYear: number;
  imei?: string;
  iccid?: string;
  status: DeviceStatus;
  registeredAt: string; // ISO datetime
  maintenanceCount: number;
};

export type BulkRow = {
  rowNumber: number;
  data: Partial<Record<keyof Device, string>>;
  valid: boolean;
  errors: string[];
  duplicate: boolean;
};
