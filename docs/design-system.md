# Lastro — Design System

> Version: 0.1 (MVP)
> Scope: light theme only. Dark theme deferred.
> Tokens: `web/src/app/globals.css`

---

## 1. Brand

**Lastro** — from the Portuguese/nautical term for the *ballast* that keeps a vessel stable, and the accounting term for the *reserve* that backs an operation. The system is the *lastro* of the company physical fleet: the solid, traceable record that anchors every device from supplier to disposal.

**Identity statement:**
> Lastro is the source of truth for every IoT device Novus Tech owns — from the moment it arrives to the moment it is written off.

**Voice:** operational, precise, never playful. Screens should read like a well-kept ledger, not a marketing site.

---

## 2. Color

### Primary brand
Indigo-blue `--color-brand-500 #3f63f0`. Used sparingly: primary buttons, focus rings, active nav item, key links. Never as a large background fill.

### Neutral scale
Cool-gray ramp tuned for dense data reading. `neutral-0` is app background; `neutral-50` for zebra rows and subtle surfaces; `neutral-200/300` for borders; `neutral-500` for muted text; `neutral-800` for headings.

### Status palette (bound to existing emoji language)

| Emoji / meaning | Token family | Notes |
|---|---|---|
| Yellow — In Stock, Pending Invoice | `status-stock` (amber) | Warm, attention without alarm |
| White — Reserved, In Transit, Delivered | `status-transit` (cool neutral) | Distinct from generic UI gray so pills read as intentional |
| Blue — In Picking | `status-picking` (blue) | Kept apart from brand indigo to avoid confusion with actions |
| Green — In Operation, Communicating | `status-operation` (green) | Healthy lifecycle state |
| Orange — Field Failure, Awaiting Return NF | `status-failure` (orange) | Needs attention, not yet critical |
| Red — In Maintenance | `status-maintenance` (red) | Off-network, on the bench |
| Black — Disposed / Written Off | `status-disposed` (near-black) | Terminal, archival |
| Check — Final Write-Off (fiscal) | `status-success` (deep teal) | Fiscal completeness. Distinct from operation-green to avoid conflating lifecycle vs fiscal dimensions |
| Warning — Communication Failure | `status-warning` (amber-red) | Sub-status warning, not a hard error |

Each status ships three variants: `-bg` (tinted pill background), `-fg` (text/icon on tint, WCAG AA verified), `-solid` (saturated hue for dots, borders, focus).

### Accessibility
- Body text on neutral surfaces: 7:1+ contrast.
- All status `-fg` on `-bg`: 4.5:1+ (AA).
- Status is **never** signaled by color alone — always pair with a dot, label, or icon.

---

## 3. Typography

**Font:** **Inter** (Google Fonts, self-hosted via `next/font`).
Rationale: designed for UI, high x-height, excellent legibility at 11-13px, which matters for table cells. Ships tabular numerals (`tnum`) and OpenType variants (`cv02`, `cv11`, `ss01`) enabled globally for aligning serials, dates, and quantities.

**Monospace:** **JetBrains Mono** for serials, IMEI, ICCID, and NF numbers where character disambiguation matters (0/O, 1/l).

### Scale

| Token | Size | Line-height | Use |
|---|---|---|---|
| `text-display` | 48px | 1.1 | Dashboard hero numbers only |
| `text-h1` | 36px | 1.1 | Page title |
| `text-h2` | 28px | 1.2 | Section title |
| `text-h3` | 22px | 1.3 | Sub-section, modal title |
| `text-h4` | 18px | 1.3 | Card title |
| `text-body-lg` | 16px | 1.5 | Form inputs, reading body |
| `text-body` | 15px | 1.5 | Default UI text |
| `text-small` | 13px | 1.5 | Table cells, secondary text |
| `text-micro` | 11px | 1.4 | Uppercase labels, meta (letter-spacing `wide`) |

**Weights:** 400 regular, 500 medium (default weight for buttons and labels), 600 semibold (headings), 700 bold (rare — reserve for emphasis in dense screens).

---

## 4. Spacing, Radius, Shadows

### Spacing — 4px base
`1=4 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 8=32 · 10=40 · 12=48 · 16=64 · 20=80`

Rhythm rules:
- Inside a component: 8 or 12 px.
- Between related items (list rows, form fields): 12 or 16 px.
- Between sections: 24 or 32 px.
- Between page regions: 48 or 64 px.

### Radius
`xs 2 · sm 4 · md 6 (default: inputs, buttons) · lg 8 (cards, modals) · xl 12 · 2xl 16 · pill 999`

### Shadows
Subtle by design — operational tools should feel flat and honest, not showy.
- `xs`, `sm`: table row hover, inline dropdowns.
- `md`: floating cards, popovers.
- `lg`: modal dialogs, sidebar drawers.
- `xl`: full-screen overlays.
- `focus`: 3px brand ring at 25% alpha — always visible on keyboard focus.

---

## 5. Iconography

**Library:** **lucide-react**.

**Rationale:**
- Consistent 1.5px stroke on a 24x24 grid — reads clean at 16px (table row actions) and 20px (sidebar).
- Tree-shakeable per-icon import, no bundle bloat.
- Comprehensive coverage of logistics and inventory metaphors we need: `Package`, `Truck`, `Warehouse`, `Wrench`, `ClipboardCheck`, `Barcode`, `RotateCcw`, `AlertTriangle`.
- MIT license, actively maintained, aesthetically aligned with the Linear / Vercel visual language we are targeting.

**Rules:**
- Sizes: 14, 16, 20, 24. Never scale a 24px icon down with CSS — use the smaller size.
- Stroke: default 1.5px. Never mix stroke widths in the same screen.
- Color: inherits `currentColor`. Icons match the text color of their parent, or the `-solid` token of the associated status.

---

## 6. Component patterns

### Status pill
A rounded-pill (`radius-pill`) container using the status token trio: `-bg` background, `-fg` text, and a 6px solid dot in `-solid` at the leading edge. Height 22px, `text-micro` uppercase, 8px horizontal padding, `letter-spacing: wide`. The dot-plus-label pairing means the state is never conveyed by color alone. Fiscal status pills sit *next to* (never inside) logistic status pills, separated by a 4px gap.

### Primary button
`brand-500` background, white text, `text-body` medium weight, `radius-md`, `space-3` vertical and `space-4` horizontal padding. Hover: `brand-600`. Active: `brand-700`. Focus: `shadow-focus` ring. Disabled: `neutral-200` background, `neutral-400` text, no shadow, `cursor-not-allowed`. Height fixed at 36px (compact) or 40px (default) to align with form inputs.

### Secondary button
Transparent background, 1px `border-strong`, `text-primary` label. Hover: `surface-hover` fill, border darkens one step. Used for cancel, back, and tertiary actions. Same sizing as primary. A **ghost** variant drops the border entirely for toolbar-style contexts (table row actions, sidebar collapse).

### Form input
White surface, 1px `border`, `radius-md`, 40px height, `text-body-lg` for the value, `space-3` horizontal padding. Label sits above at `text-small` medium `text-secondary`. Focus: `brand-500` border plus `shadow-focus` ring. Error: `danger-solid` border plus red helper text below. Placeholder in `text-disabled`. Serial, IMEI, and ICCID fields render in `font-mono` for character clarity.

### Table row
Compact by default: 44px row height, `text-small` cells, `space-4` horizontal cell padding, `border-b border` between rows. Header row: `text-micro` uppercase `text-muted`, `surface-subtle` background, sticky on scroll. Row hover: `surface-hover` fill. Zebra striping optional (`surface-subtle` on odd rows) — enable only for tables longer than 20 rows. Numeric and mono columns right-aligned; text columns left-aligned. Row actions appear on hover in the rightmost cell as ghost icon buttons.

### Sidebar item
`space-3` vertical and `space-3` horizontal padding, `radius-md`, 16px leading lucide icon plus `text-body` label. Default: `text-secondary`. Hover: `surface-hover` background, `text-primary` label. Active: `brand-50` background, `brand-700` label, `brand-500` 2px leading indicator bar. Nested items indent by 24px (icon width + gap) and drop the icon. Collapsed sidebar shows icon only, 40x40 hit area, tooltip on hover.

### Empty state
Centered block within the content region: 48x48 muted lucide icon (`neutral-400`), `text-h4` title in `text-primary`, `text-body` description in `text-secondary` (max 380px wide for readability), one primary action button below. Vertical rhythm: 16px between icon and title, 8px title to description, 24px description to action. Used for empty tables, filtered-to-zero states, and first-run screens.

### Modal
`radius-lg` surface, `shadow-xl`, max-width 560px (default) or 720px (form-heavy), centered with 40px viewport margin. Header: `text-h3` title plus close icon button, `space-6` padding, `border-b border`. Body: `space-6` padding, scrollable when content exceeds 60vh. Footer: `space-4` padding, `border-t border`, right-aligned actions (secondary left, primary right, 8px gap). Backdrop: `neutral-900` at 40% alpha. Escape closes; focus is trapped inside; focus returns to the trigger on close.

---

## 7. Motion

- Micro-interactions at or under 180ms, standard easing `cubic-bezier(0.2, 0, 0, 1)`.
- Modals and drawers: 240ms enter, 180ms exit.
- No decorative animation. Motion signals state change (open, close, load), nothing else.
- `prefers-reduced-motion` disables all transitions globally (already handled in `globals.css`).

---

## 8. Non-goals for MVP

- Dark theme.
- Custom illustrations.
- Marketing pages / public surfaces.
- Data-viz color palette beyond the status tokens (charts will re-use status tokens where semantically appropriate; a dedicated categorical scale comes in v0.2).
