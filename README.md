# Real Estate CEO Mobile Dashboard

A mobile application and backend API built for the CEO of a real estate company to monitor 5 key departments (Sales, Operations, Finance, Marketing, HR) from a single screen and perform live mutating actions.

---

## Tech Stack

- **Frontend:** React Native (Expo SDK 57), TypeScript, React Navigation (Native Stack), Expo SecureStore, Axios
- **Backend:** Node.js, Express, TypeScript, JWT (`jsonwebtoken`), CORS

---

## Department Status Logic (Dynamic & Data-Driven)

Status indicators (Green, Amber, Red) are computed dynamically in `backend/src/statusLogic.ts` based on current data:

### 1. Sales
- **Green:** Active Deals $\ge 4$ and Pipeline Value $\ge \$15\text{M}$
- **Amber:** Active Deals $2 - 3$ or Pipeline Value between $\$8\text{M} - \$15\text{M}$
- **Red:** Active Deals $< 2$ or Pipeline Value $< \$8\text{M}$

### 2. Operations
- **Green:** Overdue Tasks $= 0$
- **Amber:** Overdue Tasks $1 - 2$
- **Red:** Overdue Tasks $> 2$ *(Initial: 3 overdue tasks = Red. Reassigning a task moves it to in_progress, reducing overdue count to 2 = Amber)*

### 3. Finance
- **Green:** Monthly Revenue Quota $\ge 80\%$ and Pending Invoices $\le 2$
- **Amber:** Revenue Quota $60\% - 79\%$ or Pending Invoices $3 - 5$ *(Initial: 3 pending invoices = Amber. Approving an invoice reduces pending count to 2 = Green)*
- **Red:** Revenue Quota $< 60\%$ or Pending Invoices $> 5$

### 4. Marketing
- **Green:** Active Campaigns $\ge 3$ and Weekly Leads $\ge 80$
- **Amber:** Active Campaigns $1 - 2$ or Weekly Leads $40 - 79$
- **Red:** 0 Active Campaigns or Weekly Leads $< 40$

### 5. HR
- **Green:** Attendance $\ge 90\%$ and Open Positions $\le 3$
- **Amber:** Attendance $80\% - 89\%$ or Open Positions $4 - 5$
- **Red:** Attendance $< 80\%$ or Open Positions $> 5$

---

## 5 Department Actions (Data Mutation)

| Department | Screen | Action | API Endpoint |
| :--- | :--- | :--- | :--- |
| **Sales** | `SalesScreen.tsx` | Mark Deal Won or Lost | `PATCH /api/sales/deals/:id/status` |
| **Operations** | `OperationsScreen.tsx` | Reassign Overdue Task | `PATCH /api/operations/tasks/:id/reassign` |
| **Finance** | `FinanceScreen.tsx` | Approve Pending Invoice | `PATCH /api/finance/invoices/:id/approve` |
| **Marketing** | `MarketingScreen.tsx` | Pause / Activate Campaign | `PATCH /api/marketing/campaigns/:id/status` |
| **HR** | `HRScreen.tsx` | Approve Leave Request | `PATCH /api/hr/leave-requests/:id/approve` |

---

## How to Run

### 1. Start Backend Server
```bash
npm run backend
```
Backend runs on `http://localhost:5001`.

### 2. Start Mobile App (Expo)
```bash
npx expo start
```
- Press `a` for Android
- Press `w` for Web
- Press `i` for iOS

### 3. Run Logic & E2E Tests
```bash
npm run test:backend
```

---

## Authentication Credentials

- **Email:** `ceo@realestate.com`
- **Password:** `admin123`

The JWT token is securely stored on the device using `expo-secure-store` (`localStorage` on Web) and automatically attached to API requests via an Axios interceptor.
