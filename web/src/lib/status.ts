import type { DeviceStatus } from "./types";

export type StatusToken =
  | "stock"
  | "transit"
  | "picking"
  | "operation"
  | "failure"
  | "maintenance"
  | "disposed";

export const STATUS_LABEL: Record<DeviceStatus, string> = {
  "in-stock": "In Stock",
  reserved: "Reserved",
  "in-picking": "In Picking",
  "in-transit": "In Transit",
  delivered: "Delivered",
  "in-operation": "In Operation",
  "field-failure": "Field Failure",
  "awaiting-return-invoice": "Awaiting Return Invoice",
  "in-maintenance": "In Maintenance",
  disposed: "Disposed",
};

export const STATUS_TOKEN: Record<DeviceStatus, StatusToken> = {
  "in-stock": "stock",
  reserved: "transit",
  "in-picking": "picking",
  "in-transit": "transit",
  delivered: "transit",
  "in-operation": "operation",
  "field-failure": "failure",
  "awaiting-return-invoice": "failure",
  "in-maintenance": "maintenance",
  disposed: "disposed",
};
