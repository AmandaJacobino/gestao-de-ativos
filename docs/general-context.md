---
tags:
  - asset-management
  - context
created: 2026-06-02
status: in-progress
related:
  - "[[flow-01-receiving-and-registration]]"
  - "[[flow-02-provisioning-and-dispatch]]"
  - "[[flow-03-reverse-logistics]]"
  - "[[flow-04-maintenance-and-repair]]"
---

# General Context — Asset Management System

> Created: 2026-06-02
> Status: In progress — based on the initial reading of `PROJETO - GESTÃO DE ATIVOS.md`

---

## Why this system exists

At the company I work for, we had no visibility into our devices. We were using Monday to manage them — tracking stock, deployments, returns, everything — but Monday was never built for this. It was a workaround, not a solution.

I proposed building an internal system, tailored to our operation: keeping the workflows we were already used to in Monday, and adding what we needed but never had — full lifecycle traceability, fiscal control, maintenance history, and real-time status per device.

> **Note:** this is a fantasy development for a case study. The system is not in production.

---

## What the system is

An internal system to **track and control the complete lifecycle of IoT devices** — from supplier arrival to disposal, including field deployment, return, and maintenance.

The system aims for maximum **fiscal traceability** (Invoice/NF) and real-time visibility into each device's status. In this phase, however, the focus is **operational efficiency**: on **dispatch**, the NF is encouraged but not blocking (flag `Pending Invoice` / `Final Write-Off`); on **return**, the blocking is maintained. See section below.

---

## Inventory × Fiscal Direction (2026-06-09)

**Core problem — nomenclature mismatch:** the same device is identified differently in **Inventory** (operational name, e.g. `NVT-45205`) and in **Finance/Fiscal** (technical/accounting name, e.g. `Prism-v2-R3`). Unifying both databases today would require recalling all field devices — not feasible. For this reason the project **starts isolated from the Omie ERP**, focused on Operations; any Omie automation is **Future Phase (Back-end)**.

**Phase 1 adaptations (relaxed constraints):**
- **100% manual reservation**, restricted to Inventory (Omie does not support reservations).
- **NF (dispatch and return) registered manually + PDF upload**.
- **Dispatch without hard blocking:** allows dispatch marking `Pending Invoice`; with NF, `Final Write-Off`. **Return maintains the block**.
- **Return routed by model / flexible destination** — Aurora/Sentinel → third-party; FlowTrack → own stock; can return to current or new customer.

**Transition strategy (future vision):**
- **Short/medium term (loan/rental):** devices belong to Novus Tech, in the customer's possession. System controls quantity, who has what, maintenance NF issuance and lifecycle.
- **Long term (definitive sale):** devices sold to the customer; control becomes transactional only (how many/which were sold).

**Sanitation goal:** achieve **> 90% physical stock reliability** before any systemic integration with Omie.

---

## Actors (system users)

| Actor | Primary role |
|---|---|
| **Operations** | Receives devices, manages stock, approves reservations, separates equipment for dispatch |
| **Sales/Commercial** | Views available quantity; SalesGrid integration creates automatic reservation requests |
| **Finance / Fiscal** | Issues dispatch NF and return NF; unblocks flow steps |
| **Technical Support** | Opens retrieval tickets when a device fails in the field |
| **Lab / AT** | Performs triage and repair of devices under maintenance; records the outcome (Approved / Rejected) |
| **CEO** | View / management access |
| **Engineering** | Technical access |
| **CS (Customer Success)** | Tracks devices at the customer site |
| **Devs** | Technical access to the system |

---

## Systems and their devices

The company has three monitoring systems, each with specific devices:

| System | Device | Behavior on delivery |
|---|---|---|
| **Aurora** | Prism | "In Operation" only after field installation and communication |
| **Sentinel** | Nexus | "In Operation" only after field installation and communication |
| **FlowTrack** | DataHub (kit) | "In Operation" automatically upon delivery (no installation required) |
| — | **Fusion** (Prism + Nexus) | In development; already in use in Portugal. Same behavior as Prism/Nexus. |

### FlowTrack kit composition

A FlowTrack contract includes the following kit per contracted unit:

| Item | Qty |
|---|---|
| DataHub (main device) | 1× |
| Poles | 3× |
| Mobile phone | 1× |
| Headset | 1× |
| Chargers | 2× (one for the phone, one for the collector) |
| Cables | 2× (one for the phone charger, one for the collector) |

> All items have serial numbers with company-issued labels. The system tracks each item individually as a separate asset.

---

## Possible device states

```
— Dispatch path —

🟡 In Stock
   ↓ (MANUAL reservation in Inventory — Operations)
⚪ Reserved
   ↓ (stock write-off — dispatch allowed with or without NF)
🔵 In Picking  ← fiscal flag: 🟡 Pending Invoice (no NF) | ✅ Final Write-Off (NF + PDF)
   ↓ (physical shipment completed)
⚪ In Transit (outbound to customer)
   ↓ (Correios confirms delivery)
   ├──► [FlowTrack] ──────────────► 🟢 In Operation (automatic)
   └──► [Prism / Nexus / Fusion] ──► ⚪ Delivered
                                           ↓ (commissioned in Aurora / Sentinel)
                                       🟢 In Operation
                                           ├──► ✅ Sub-status: Communicating
                                           └──► ⚠️ Sub-status: Communication Failure

— Return path —

🟢 In Operation
   ├──► [contract end] ──► 🟠 Awaiting Return Invoice
   └──► [field failure] ──► Operations analyzes ──► 🟠 Field Failure
         • Prism/Nexus/Fusion: Aurora/Sentinel detects > 7 days without communication
         • FlowTrack: customer report via CSI
                                          ↓
                                     🟠 Awaiting Return Invoice  ← BLOCK MAINTAINED: lab does not accept without NF (number + PDF, manual)
                                          ↓ (NF issued)
                                     ⚪ In Transit (returning)
                                          ↓ (arrived — destination by model: Aurora/Sentinel → third-party; FlowTrack → own stock)
                                     🔴 In Maintenance
                                          ├──► (approved) ──► destination: 🟡 In Stock  OR  current / new customer (re-enters Flow 2)
                                          ├──► (3+ maintenances + new failure) ──► disassembly ──► ⚫ Disposed / Written Off
                                          └──► (no repair possible) ──► ⚫ Disposed / Written Off
```

---

## Planned integrations

| System | Purpose | Status |
|---|---|---|
| **SalesGrid** | Reads closed contracts → generates reservation **request** (device reservation is **manual**) | Planned |
| **Omie** | Create sales order; pull issued NF (dispatch and return) | 🔮 **Future Phase (Back-end)**. In this phase **no native integration**: NF (dispatch and return) registered **manually** + PDF. |
| **Correios** | Tracking of dispatch to customer (polling) | Max. twice a day, at strategic times (T-02 defined) |
| **Aurora** | Commissioning, communication sub-status and failure detection (>7 days without communication) — **Prism** | New integration — to be specified |
| **Sentinel** | Same as Aurora — **Nexus** and **Fusion** | New integration — to be specified |
| **Email / WhatsApp** | Notify customer about tracking, if they don't have system access | Providers to be defined (T-05) |
| **Google Chat** | Internal notifications | Under evaluation |

---

## Identified flows

1. [[flow-01-receiving-and-registration|Receiving and Registration]] — supplier batch arrival, device registration
2. [[flow-02-provisioning-and-dispatch|Provisioning and Dispatch]] — reservation, approval, NF issuance, dispatch
3. [[flow-03-reverse-logistics|Reverse Logistics (Return)]] — retrieval for contract end or field failure
4. [[flow-04-maintenance-and-repair|Maintenance and Repair]] — triage, maintenance counter and decision to reuse or dispose

---

## Navigation structure (sidebar)

The sidebar is positioned on the left and must be **collapsible**. Menu structure:

```
Sidebar
├── Dashboard
├── Inventory
│   ├── Stock
│   │     (button "Register new device" + batch upload option)
│   ├── Requests
│   │     (device reservations originating from Sales / SalesGrid)
│   └── In Field
│         (commissioned devices — Prism/Nexus/Fusion — and FlowTrack with customer)
├── Maintenance
│     (maintenance history: whether it went to the bench and the maintenance counter)
└── In Transit
    ├── Dispatched
    │     (devices on their way to the customer)
    └── Reverse Logistics
          (devices returning — swap or contract end)
```

---

## Minimum glossary

| Term | Meaning in context |
|---|---|
| **NF** | Nota Fiscal (Brazilian tax invoice) |
| **IMEI** | Unique identifier for the device's SIM chip |
| **ICCID** | Unique identifier for the SIM card |
| **Serial** | Hardware serial number (registration primary key) |
| **Loan Agreement (Comodato)** | Contractual arrangement: customer uses the device but does not own it |
| **Commissioned** | Device installed and active at the customer site |
| **Reverse Logistics** | Process of returning the device to stock/lab |
| **Maintenance Counter** | How many times the device has undergone maintenance (limit of 3 — after that, disassembly) |
| **Barcode scanning (Bipeção)** | Act of scanning the device code to register entry/exit |
