# Northline Roofing & Exteriors - Config-Driven Estimator & Owner Panel

A full-stack, dynamic, configuration-driven web application for **Northline Roofing & Exteriors**. Built for the **Wantace SDE Take-Home Task**.

---

## 🌟 Live Deployed Links

- **Public Estimator Surface:** `https://your-app.vercel.app` (Or Render URL)
- **Owner Panel Surface:** `https://your-app.vercel.app` (Click **Owner Panel** tab)
- **Backend API:** `https://your-backend.onrender.com/api/config`

---

## 🔑 Admin Credentials (Owner Panel)

- **Username:** `admin`
- **Password:** `roofing2026!`

---

## 🚀 Key Features

1. **Surface 1 — Public Estimator (Homeowner Facing):**
   - 100% dynamic multi-step wizard.
   - Every question, label, option, range limit, and rate is fetched from `GET /api/config` at runtime. Zero hardcoded questions or pricing in client code.
   - Instant cost range calculation ($E_{\text{low}}$ to $E_{\text{high}}$) computed server-side with lead contact capture.

2. **Surface 2 — Owner Panel (Dale & Marcus Facing):**
   - Protected admin authentication (Basic Auth / Bearer JWT).
   - Real-time rate and multiplier editor: update material rates ($/sq ft), pitch multipliers, tear-off fees, and global modifiers.
   - Question toggles: turn questions on/off instantly without touching code or triggering redeployments.
   - Lead management dashboard: inspect captured leads, timestamps, and submitted homeowner answers.

3. **Backend Pricing Engine:**
   - Server-side deterministic arithmetic protecting proprietary pricing logic and preventing client-side tampering.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React (Vite), Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js REST API
- **Database:** MongoDB (Mongoose) with fallback in-memory server support
- **Auth:** JWT / Basic HTTP Auth

---

## 💻 Local Quickstart (Clean Clone Steps)

### Prerequisites
- Node.js v18.x or higher installed locally.
- Git.

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd wantace_assignment

# Install all dependencies (Monorepo root setup)
npm run setup
```

### 2. Configure Environment Variables
Create `.env` file inside `server/` (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=roofing2026!
JWT_SECRET=roofing_estimator_secret_key_2026
```
*(Note: If `MONGODB_URI` is left blank, the backend automatically initializes an in-memory MongoDB database with seed data for instant zero-setup local dev!)*

### 3. Seed Database (Optional / Automatic)
```bash
npm run seed
```

### 4. Run Application Locally
```bash
# Run both Backend (Port 5000) and Frontend (Port 3000) concurrently
npm run dev
```

Open your browser to:
- **Public Estimator:** [http://localhost:3000](http://localhost:3000)
- **Owner Panel:** [http://localhost:3000](http://localhost:3000) (Click **Owner Panel** in header)

---

## 📁 Repository Structure

```
wantace_assignment/
├── client/                     # Frontend App (React/Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── dynamic/        # Dynamic question field renderer
│   │   │   ├── estimator/      # Multi-step wizard
│   │   │   └── owner/          # Owner panel & leads table
│   │   ├── services/           # API fetch helpers
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend API (Express.js)
│   ├── src/
│   │   ├── config/             # DB connection
│   │   ├── controllers/        # Lead, Config & Auth controllers
│   │   ├── middleware/         # Auth verification middleware
│   │   ├── models/             # Mongoose schemas (Config & Lead)
│   │   ├── services/           # Pricing Calculation Engine
│   │   ├── seed.js             # Seed data migration (Version 3)
│   │   └── index.js            # Express API server entry point
│   └── package.json
├── DECISIONS.md                # Required architectural decision record
├── AI_LOG.md                   # Required AI usage log
├── README.md                   # Required setup guide
└── package.json                # Root orchestration scripts
```

---

## 🧪 Testing

Run backend pricing engine unit tests:
```bash
npm test
```
