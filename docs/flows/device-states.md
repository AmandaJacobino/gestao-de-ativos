# General Device State Diagram

## All possible states

| Status                             | Emoji | When it occurs                                                                                                                              |
| ---------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| In Stock                           | 🟡    | After registration; after approved maintenance; after reservation cancellation                                                              |
| Reserved                           | ⚪     | Contract reservation approved by Operations                                                                                                 |
| In Picking                         | 🔵    | Dispatch NF registered — device released for shipment                                                                                       |
| In Transit — outbound              | ⚪     | Shipment completed toward the customer                                                                                                      |
| Delivered                          | ⚪     | Delivered to customer — Prism / Nexus / Fusion only (awaiting installation)                                                                 |
| In Operation                       | 🟢    | FlowTrack: upon delivery. Prism/Nexus/Fusion: upon commissioning in Aurora/Sentinel. Sub-status: ✅ Communicating / ⚠️ Communication Failure |
| Field Failure                      | 🟠    | Swap confirmed by Operations after remote detection (Aurora/Sentinel > 7 days without communication) or customer report (FlowTrack via CSI) |
| Awaiting Return Invoice            | 🟠    | System awaits return NF — **fiscal BLOCK**                                                                                                  |
| In Transit — return                | ⚪     | NF issued — device on its way to lab / RepairTech / Engineering                                                                             |
| In Maintenance                     | 🔴    | Device on the bench — external RepairTech (Prism/Nexus) or internal Engineering (FlowTrack)                                                 |
| In Transit — return to stock       | ⚪     | External RepairTech only (Prism/Nexus approved) — returning to Novus Tech via Correios                                                      |
| Disposed / Written Off             | ⚫     | Rejected in maintenance / end of useful life                                                                                                |

> **Note on "In Transit — return to stock":** This state applies only to devices that went through **external RepairTech** (Prism/Nexus/Fusion). Devices that went through **internal Engineering** (FlowTrack) go directly to 🟡 In Stock, since maintenance is performed within the company.

---

## Parallel fiscal dimension (dispatch)

Beyond the **logistic** status above, the **stock write-off on dispatch** carries an independent **fiscal status**:

| Fiscal Status | When it occurs |
|---|---|
| 🟡 **Pending Invoice** | Stock write-off done **without** the NF number — dispatch allowed, but flagged for regularization |
| ✅ **Final Write-Off** | NF provided (number + PDF) — at write-off or in subsequent regularization |

> This flag does **not** replace the logistic status — it accompanies it. E.g.: a device can be 🔵 *In Picking* **and** 🟡 *Pending Invoice*. There is no hard block on dispatch in this phase (replaced by this flag). The **hard block remains only on return entry** (Awaiting Return Invoice, see below).

---

## Complete state diagram

```mermaid
stateDiagram-v2
    state "🟡 In Stock" as InStock
    state "⚪ Reserved" as Reserved
    state "🔵 In Picking" as InPicking
    state "⚪ In Transit — outbound to customer" as TransitOut
    state "⚪ Delivered" as Delivered
    state "🟢 In Operation" as InOperation
    state "🟠 Field Failure" as FieldFailure
    state "🟠 Awaiting Return Invoice" as AwaitingNF
    state "⚪ In Transit — return to lab" as TransitReturn
    state "🔴 In Maintenance" as InMaintenance
    state "⚪ In Transit — return to stock (RepairTech)" as TransitStock
    state "⚫ Disposed / Written Off" as Disposed

    [*] --> InStock : Device registered

    InStock --> Reserved : MANUAL reservation in Inventory (Operations)
    Reserved --> InPicking : Stock write-off (dispatch allowed with or without NF — fiscal flag)
    InPicking --> TransitOut : Shipment completed

    TransitOut --> InOperation : Delivered — FlowTrack
    TransitOut --> Delivered : Delivered — Prism / Nexus / Fusion
    Delivered --> InOperation : Installed in field and communicating

    InOperation --> AwaitingNF : Contract end — SalesGrid signals
    InOperation --> FieldFailure : Field failure confirmed by Operations
    Delivered --> AwaitingNF : Contract end

    FieldFailure --> AwaitingNF : System initiates reverse NF

    AwaitingNF --> TransitReturn : Return NF registered (number + PDF, manual) — block lifted
    TransitReturn --> InMaintenance : Arrived at lab / RepairTech

    InMaintenance --> TransitStock : Approved — Aurora/Sentinel (RepairTech / third-party)
    InMaintenance --> InStock : Approved — FlowTrack (internal Engineering)
    TransitStock --> InStock : Arrived — destination = stock
    TransitStock --> Reserved : Arrived — destination = customer / new customer (re-enters Flow 2)
    InMaintenance --> Reserved : Approved FlowTrack — destination = customer / new customer (re-enters Flow 2)

    InMaintenance --> Disposed : Rejected / no repair possible
    InMaintenance --> Disposed : 3+ maintenances and new failure (disassembly — L-21)
    Disposed --> [*]
```

> **Destination after maintenance:** upon approval, the device does not always return to stock — it may go **directly to the current customer** or be **reassigned to a new customer**, re-entering Flow 2 (state ⚪ Reserved).

---

## Transition rules (dev reference)

| From | To | Mandatory condition |
|---|---|---|
| In Stock | Reserved | **MANUAL reservation** in Inventory environment (Operations). Not automatic; not reflected in Omie |
| Reserved | In Picking | **Stock write-off** — dispatch allowed **with or without** NF. Fiscal flag: `Final Write-Off` (with NF + PDF) or `Pending Invoice` (without NF) |
| In Picking | In Transit outbound | Shipment registered with tracking code |
| In Transit outbound | In Operation | Correios API confirms delivery **AND** type = FlowTrack |
| In Transit outbound | Delivered | Correios API confirms delivery **AND** type = Prism / Nexus / Fusion |
| Delivered | In Operation | Commissioned in Aurora / Sentinel — Prism/Nexus/Fusion |
| In Operation | Field Failure | **After Operations analysis.** Detection: Aurora/Sentinel > 7 days without communication (Prism/Nexus/Fusion) or customer report via CSI (FlowTrack) |
| In Operation | Awaiting Return Invoice | SalesGrid signals contract termination |
| Delivered | Awaiting Return Invoice | SalesGrid signals contract termination |
| Field Failure | Awaiting Return Invoice | Automatic — system initiates reverse NF flow |
| Awaiting Return Invoice | In Transit return | `Return NF Number` registered **manually** + **PDF attached** — block lifted |
| In Transit return | In Maintenance | Entry registered — destination by model: Aurora/Sentinel → third-party; FlowTrack → own stock |
| In Maintenance | In Transit return to stock | Technician records approval **AND** type = Prism / Nexus / Fusion (external RepairTech / third-party) |
| In Maintenance | In Stock | Technician records approval **AND** type = FlowTrack (internal Engineering — direct), **if destination = stock** |
| In Maintenance | Reserved | Approved **AND** destination = current / new customer → re-enters Flow 2 |
| In Transit return to stock | In Stock | Arrival registered at Novus Tech (Correios tracking), **if destination = stock** |
| In Transit return to stock | Reserved | Arrival registered **AND** destination = customer / new customer → re-enters Flow 2 |
| In Maintenance | Disposed / Written Off | Technician records rejection / no repair possible; **or** after 3 maintenances + new failure → disassembly and parts salvage (L-21) |

---

## Open gaps affecting this diagram

| ID | Impact on diagram | Status |
|---|---|---|
| L-07 | Transition → Disposed: asset write-off in Omie | 🔮 Deferred — Future Phase. In this phase the system only marks ⚫ Disposed; manual write-off outside the system |
| L-16 | Is "Field Failure" an official visible state or just a flag/label? | ❓ Open |
| L-19 | After Operations analysis, is the replacement device reservation automatic or manual? | ❓ Open |
| L-20 | Is the 7-day communication limit fixed or configurable? | ❓ Open |
| L-21 | Is "Disassembly / parts salvage" its own state? How do salvaged parts return to stock? | ❓ Open |
