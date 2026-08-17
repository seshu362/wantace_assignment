# Northline Roofing & Exteriors — Config-Driven Estimator & Owner Panel

A full-stack, dynamic, configuration-driven web application for **Northline Roofing & Exteriors**.  
Built for the **Wantace SDE Take-Home Task**.

---

## 🚀 Live Deployed Links & Video Demo

- **GitHub Repository:** [https://github.com/seshu362/wantace_assignment](https://github.com/seshu362/wantace_assignment)
- **Video Demo (Google Drive):** [https://drive.google.com/file/d/1gLIWKEZ32xO_YfjiG6P5N_tcsKP5rkJE/view](https://drive.google.com/file/d/1gLIWKEZ32xO_YfjiG6P5N_tcsKP5rkJE/view)
- **Public Estimator Surface (Render / Live):** [https://northline-roofing-estimator-xaq6.onrender.com](https://northline-roofing-estimator-xaq6.onrender.com)
- **Owner Panel Surface (Render / Live):** [https://northline-roofing-estimator-xaq6.onrender.com](https://northline-roofing-estimator-xaq6.onrender.com) *(Click **Owner Panel** in top navigation)*
- **Backend REST API:** [https://wantace-assignment-7m2t.onrender.com/api/config](https://wantace-assignment-7m2t.onrender.com/api/config)

---

## 🔑 Owner Panel Test Credentials

Access to Surface 2 (Owner & Bookkeeper Panel) is protected by authentication:

| Field | Value |
|---|---|
| **Username** | `admin` |
| **Password** | `roofing2026!` |

---

## 🌟 Key Product Features

### Surface 1: Public Homeowner Estimator
- **100% Dynamic Engine:** Every question, label, option, range limit, unit, and calculation rate is fetched from `GET /api/config` at runtime. **Zero hardcoded questions or pricing in client code.**
- **Multi-Step Wizard:** Smooth step-by-step navigation with progress indicator bar, dynamic input rendering (`number` inputs with range validation, `select` radio card options), step fade-in animations, and contact details capture step.
- **Server-Side Pricing Display:** Displays the calculated cost range ($E_{\text{low}}$ to $E_{\text{high}}$) with detailed cost breakdown (materials, labor, tear-off, multipliers, permit flat fee).

### Surface 2: Owner & Bookkeeper Panel (Dale & Marcus)
- **Protected Authentication:** Secured via admin login (Bearer JWT / Basic HTTP Auth).
- **Config & Pricing Editor:** Business owners (Dale) and bookkeepers (Marcus) can edit question labels, toggle question active status, edit material rates ($/sq ft), pitch multipliers, tear-off fees, and global modifiers (`waste_factor`, `permit_flat_fee`, `range_spread_pct`).
- **Instant Live Updates:** Saving changes in the Owner Panel increments `config_version` and reflects immediately on the Public Estimator without redeploying code or restarting the server.
- **Lead Management Dashboard:** Displays all captured customer leads with timestamp, contact info, estimate range, and expandable submitted answers.

---

## 🛠️ Stack & Architecture

- **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Glassmorphism UI
- **Backend:** Node.js, Express.js REST API
- **Database:** MongoDB (Mongoose) with fallback in-memory server support (`mongodb-memory-server`)
- **Testing:** Automated unit testing (`npm test` in `server`)

---

## 💻 Local Installation & Quickstart

### Prerequisites
- Node.js v18.x or higher installed locally.
- Git.

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/seshu362/wantace_assignment.git
cd wantace_assignment

# Install dependencies for both server and client
npm run setup
```

### 2. Configure Environment Variables
Create a `.env` file inside `server/` (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=roofing2026!
JWT_SECRET=roofing_estimator_secret_key_2026
NODE_ENV=development
```
*(Note: If `MONGODB_URI` is left blank, the backend automatically initializes an in-memory database with Version 3 seed data for instant zero-setup local execution!)*

### 3. Run Development Servers
```bash
# Run both Backend (Port 5000) and Frontend (Port 3000) concurrently
npm run dev
```

Open your browser to:
- **Public Estimator:** [http://localhost:3000](http://localhost:3000)
- **Owner Panel:** [http://localhost:3000](http://localhost:3000) *(Click **Owner Panel** in top navigation)*

---

## 🧪 Running Automated Tests

Run backend pricing engine unit tests:
```bash
npm test
```

---

## 📁 Repository Structure

```
wantace_assignment/
├── client/                     # Frontend App (React / Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── dynamic/        # Dynamic question field renderer
│   │   │   ├── estimator/      # Multi-step wizard
│   │   │   └── owner/          # Owner panel & leads table
│   │   ├── services/           # API fetch helpers
│   │   ├── App.jsx             # Main App & Surface Switcher
│   │   ├── index.css           # Styling & Glassmorphism design
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend API (Express.js)
│   ├── src/
│   │   ├── config/             # Database connection setup
│   │   ├── controllers/        # Lead, Config & Auth controllers
│   │   ├── middleware/         # Auth verification middleware
│   │   ├── models/             # Mongoose schemas (Config & Lead)
│   │   ├── services/           # Pricing Calculation Engine
│   │   ├── tests/              # Calculator unit tests
│   │   ├── seed.js             # Seed data migration (Version 3)
│   │   └── index.js            # Express server entry point
│   └── package.json
├── DECISIONS.md                # Required architectural decision record
├── AI_LOG.md                   # Required AI usage log
├── README.md                   # Setup & documentation guide
└── package.json                # Root orchestration scripts
```
