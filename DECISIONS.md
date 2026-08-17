# Architectural Decision Record (DECISIONS.md)

**Project:** Config-Driven Estimator & Owner Panel  
**Client:** Northline Roofing & Exteriors (Columbus, OH)  
**Author:** Candidate SDE Intern  

---

## 1. Executive Summary & Stack Selection Rationale

For this application, we selected a modern **MERN-like stack**:
- **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons + Glassmorphic UI design system.
- **Backend:** Node.js + Express.js REST API with modular controllers and middlewares.
- **Database:** MongoDB (via Mongoose) with an automated `mongodb-memory-server` fallback for zero-setup local execution and MongoDB Atlas compatibility for free-tier Render cloud deployment.

### Why this stack?
1. **Zero Hardcoded Logic:** React components serve purely as dynamic view renderers. Questions, options, rates, and limits are fetched at runtime from `GET /api/config`.
2. **Server-Side Pricing Security:** All estimate arithmetic takes place inside `server/src/services/calculator.js` to ensure clients cannot tamper with prices.
3. **Instant Non-Technical Editing:** Updates made by Dale or Marcus in the Owner Panel immediately persist to the database and increment `config_version` without requiring any code rebuilds or server restarts.

---

## 2. Plain-Language Explanation of Pricing Formula

The calculation engine evaluates customer responses deterministically using the following formula:

$$\text{Base Material Cost} = A \times R_m \times (1 + W)$$
$$\text{Tear-Off Cost} = A \times R_t$$
$$\text{Adjusted Subtotal} = (\text{Base Material Cost} + \text{Tear-Off Cost}) \times M_p \times M_s$$
$$\text{Midpoint Estimate } (E_{\text{mid}}) = \text{Adjusted Subtotal} + F_p$$
$$\text{Estimate Low } (E_{\text{low}}) = E_{\text{mid}} \times (1 - S)$$
$$\text{Estimate High } (E_{\text{high}}) = E_{\text{mid}} \times (1 + S)$$

### Variables Explained:
- **$A$ (Roof Area):** Entered square footage (validated between 300 and 12,000 sq ft).
- **$R_m$ (Material Cost Rate):** Selected material rate (e.g., Asphalt 3-tab = $4.25/sq ft, Standing Seam Metal = $12.40/sq ft).
- **$W$ (Waste Factor):** Configurable global modifier (Default: $0.10$ or 10%).
- **$R_t$ (Tear-Off Rate):** Cost per sq ft based on old roofing layers (e.g., 0 layers = $0, 1 layer = $1.15, 2 layers = $2.05).
- **$M_p$ (Pitch Multiplier):** Pitch steepness factor (Low = $1.0$, Medium = $1.12$, Steep = $1.30$).
- **$M_s$ (Stories Multiplier):** Height factor (1 storey = $1.0$, 2 storeys = $1.08$, 3 storeys = $1.18$).
- **$F_p$ (Permit Flat Fee):** Fixed local permit fee ($350).
- **$S$ (Range Spread):** Percentage spread ($12\%$) creating $E_{\text{low}}$ and $E_{\text{high}}$.

---

## 3. Seed Data & Brief Oddities Handled

1. **String Multipliers in Seed Data:** In the raw JSON export (Version 3), the medium pitch multiplier was formatted as a string (`"multiplier": "1.12"`) while others were floats (`1.0`). We implemented robust `safeNumber()` helpers in `calculator.js` and normalized schema types to safely parse strings into numbers without `NaN` errors.
2. **Historical Lead Schema Variation:** Historical seed lead `ld_0917` referenced `config_version: 1` with legacy questions (`chimney_count`, `gutter_replace`). We built the `LeadsTable.jsx` component to render answers dynamically via `Object.entries()` rather than hardcoding expected keys.

---

## 4. What Was Deliberately NOT Built (Scope Trade-offs)

Under the 24-hour build constraint, scope discipline was prioritized over feature bloat:
- **Multi-Tenant Organization Roles:** We used single-org authentication (`admin` / `roofing2026!`) instead of multi-company RBAC.
- **Complex Payment Gateways:** Depositing booking fees was omitted as out-of-scope for an estimator tool.

---

## 5. Questions for Dale Before Full Production Launch

1. **Local Tax Rates:** Should municipal sales tax be calculated separately or included in the material rates?
2. **Email Notifications:** Should an email notification (via SendGrid/Nodemailer) automatically dispatch to Marcus whenever a new lead submits an estimate?
3. **Custom Disclaimers:** What legal disclaimer text should be displayed below the cost range on the public site?

---

## 6. Next Steps If Given Another Week

1. **CSV Export & Webhooks:** Add export buttons for Marcus to download leads as CSV and configure outbound webhooks (Zapier/Make).
2. **Config History & Rollback:** Allow Dale to view previous `config_version` snapshots and restore a previous version with one click.
3. **Visual Roof Diagram Preview:** Interactive 2D roof pitch preview visualizer for homeowners.
