# System Architecture & Technical Specifications
**Sterling & Co. Real Estate — Executive Command Center**

---

## 1. High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT APPLICATION                                 │
│                  (React Native / Expo Mobile & Web)                         │
│                                                                             │
│  ┌─────────────────────────┐         ┌───────────────────────────────────┐  │
│  │   Authentication View   │ ──────> │        Executive Dashboard        │  │
│  │    (JWT Credentials)    │         │  (Real-time Department Monitor)   │  │
│  └─────────────────────────┘         └─────────────────┬─────────────────┘  │
│                                                        │                    │
│      ┌─────────────────┬───────────────────────────────┼─────────────┐      │
│      ▼                 ▼                               ▼             ▼      │
│  ┌─────────┐   ┌───────────────┐               ┌─────────────┐   ┌────────┐ │
│  │  Sales  │   │  Operations   │               │   Finance   │   │ HR &   │ │
│  │ Pipeline│   │ Maintenance   │               │ Invoicing   │   │ Growth │ │
│  └────┬────┘   └───────┬───────┘               └──────┬──────┘   └───┬────┘ │
│       │                │                              │              │      │
└───────┼────────────────┼──────────────────────────────┼──────────────┼──────┘
        │                │                              │              │       
        ▼                ▼                              ▼              ▼       
┌─────────────────────────────────────────────────────────────────────────────┐
│                      API CLIENT & STATE INTERCEPTOR                         │
│         • Bearer Token Injection • Timeout Thresholds • Failover Cache       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST / JSON (HTTP)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND REST SERVICES                             │
│                       (Node.js / Express / TypeScript)                      │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     JWT Authentication Middleware                     │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│  ┌───────────────────────────────────▼───────────────────────────────────┐  │
│  │                        Business Logic Layer                           │  │
│  │  • getSalesStatus()        • getOperationsStatus()                    │  │
│  │  • getFinanceStatus()      • getMarketingStatus() • getHRStatus()     │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│  ┌───────────────────────────────────▼───────────────────────────────────┐  │
│  │                       Data Entities & Models                          │  │
│  │  • Deals Model             • Operations & Tasks                       │  │
│  │  • Invoices & Approvals    • Ad Campaigns & Employee Directory        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Department Health & Business Evaluation Rules

The dashboard aggregates multi-department KPIs and maps them to standard operational health states: **Green (On Track)**, **Amber (Needs Attention)**, and **Red (Critical Action Required)**.

### 2.1 Sales & Pipeline (`getSalesStatus`)
- **Metric Scope:** Evaluates active real estate deals in the pipeline and total estimated pipeline value.
- **Evaluation Thresholds:**
  - `Red`: Active deals < 2 OR Pipeline gross value < $8.0M
  - `Amber`: Active deals < 4 OR Pipeline gross value < $15.0M
  - `Green`: Active deals >= 4 AND Pipeline gross value >= $15.0M
- **Supported Mutation:** Real-time deal status transitions (`pipeline` → `won` / `lost`).

### 2.2 Site Operations & Facilities (`getOperationsStatus`)
- **Metric Scope:** Tracks property inspection tasks, contractor schedules, and maintenance SLA compliance.
- **Evaluation Thresholds:**
  - `Red`: Overdue tasks > 2
  - `Amber`: Overdue tasks between 1 and 2
  - `Green`: Zero overdue tasks
- **Supported Mutation:** Direct ticket reassignment to senior operations managers to clear backlog.

### 2.3 Finance & Invoicing (`getFinanceStatus`)
- **Metric Scope:** Tracks target revenue realization percentage and pending payout approvals.
- **Evaluation Thresholds:**
  - `Red`: Revenue vs Target < 60% OR Pending invoices count > 5
  - `Amber`: Revenue vs Target < 80% OR Pending invoices count >= 3
  - `Green`: Revenue vs Target >= 80% with manageable invoice volume
- **Supported Mutation:** One-click invoice authorization and release.

### 2.4 Marketing & Lead Acquisition (`getMarketingStatus`)
- **Metric Scope:** Evaluates weekly inbound lead velocity across digital and search ad channels.
- **Evaluation Thresholds:**
  - `Red`: Active campaigns = 0 OR Weekly leads < 40
  - `Amber`: Active campaigns < 3 OR Weekly leads < 80
  - `Green`: Active campaigns >= 3 AND Weekly leads >= 80
- **Supported Mutation:** Campaign lifecycle toggle (`active` ↔ `paused`).

### 2.5 Human Resources & Staffing (`getHRStatus`)
- **Metric Scope:** Monitors daily workforce attendance ratio and unfilled strategic roles.
- **Evaluation Thresholds:**
  - `Red`: Attendance ratio < 80% OR Open positions > 5
  - `Amber`: Attendance ratio < 90% OR Open positions > 3
  - `Green`: Attendance ratio >= 90% AND Open positions <= 3
- **Supported Mutation:** Leave request evaluation and authorization.

---

## 3. Technology Stack & Key Specifications

| Component | Framework / Library | Role & Specification |
|---|---|---|
| **Mobile Client** | React Native (Expo SDK 57), TypeScript | Cross-platform runtime with strict type safety |
| **Navigation** | React Navigation (Native Stack v7) | Native stack transitions and route management |
| **API Client** | Axios | Configured with request interceptors and timeout guards |
| **Backend Server** | Node.js, Express.js, TypeScript | Modular REST API routing and logic computation |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | Stateless token generation and Bearer header verification |
| **Persistence** | Expo SecureStore / LocalStorage | Secure token caching across application restarts |

---

## 4. API Endpoints Specification

### Authentication
- `POST /api/auth/login` — Authenticates credentials and issues signed JWT.

### Metrics & Aggregations
- `GET /api/dashboard` — Returns aggregated health metrics for all 5 departments.

### Department Modules
- `GET /api/sales` & `PATCH /api/sales/deals/:id/status` — Deal pipeline read and update.
- `GET /api/operations` & `PATCH /api/operations/tasks/:id/reassign` — Task list and assignee modification.
- `GET /api/finance` & `PATCH /api/finance/invoices/:id/approve` — Invoice review and approval.
- `GET /api/marketing` & `PATCH /api/marketing/campaigns/:id/status` — Ad campaign monitoring and toggle.
- `GET /api/hr` & `PATCH /api/hr/leave-requests/:id/approve` — Employee headcount and leave approval.
