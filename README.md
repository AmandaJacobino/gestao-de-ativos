# Asset Management System

Internal system for tracking the complete lifecycle of IoT devices — from supplier arrival to disposal, through field deployment, return, and maintenance.

## The problem

At the company I work for, we had no visibility into our devices. We were using Monday to manage them — tracking stock, deployments, returns, and maintenance — but Monday was never built for this. It was a workaround, not a solution.

I proposed building an internal system, tailored to our operation: keeping the workflows we were already used to in Monday, and adding what we needed but never had — full lifecycle traceability, fiscal control, maintenance history, and real-time status per device.

> **Note:** this is a fantasy development for a case study. The system is not in production.

## About

Novus Tech operates three device monitoring systems, each with distinct hardware and field behavior:

| System | Device | On Delivery |
|---|---|---|
| Aurora | Prism | Requires field installation before entering operation |
| Sentinel | Nexus / Fusion | Requires field installation before entering operation |
| FlowTrack | DataHub (kit) | Enters operation automatically on delivery |

The system is isolated from the Omie ERP in Phase 1. Invoices (NF) are manually registered. Omie integration is Future Phase (Back-end).

## Documentation

### Context

- [`docs/general-context.md`](docs/general-context.md) — System overview, actors, device states, planned integrations, glossary

### Flows

- [`docs/flows/device-states.md`](docs/flows/device-states.md) — Complete state machine with transition rules and Mermaid diagram
- [`docs/flows/flow-01-receiving-and-registration.md`](docs/flows/flow-01-receiving-and-registration.md) — Supplier batch arrival and device registration (individual and bulk)
- [`docs/flows/flow-02-provisioning-and-dispatch.md`](docs/flows/flow-02-provisioning-and-dispatch.md) — Reservation via SalesGrid, NF write-off, dispatch and tracking
- [`docs/flows/flow-03-reverse-logistics.md`](docs/flows/flow-03-reverse-logistics.md) — Device return for contract end or field failure
- [`docs/flows/flow-04-maintenance-and-repair.md`](docs/flows/flow-04-maintenance-and-repair.md) — Repair at RepairTech (Prism/Nexus/Fusion) or internal Engineering (FlowTrack)

## Phase scope

**Phase 1 (current):** Manual operations — reservations, NF registration, return routing. Isolated from Omie. Focus on operational efficiency and stock reliability (target > 90%).

**Phase 2 (Back-end):** Omie integration for automatic NF capture, asset write-off on disposal, and inventory/fiscal nomenclature mapping.
