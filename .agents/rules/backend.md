# ⚙️ Backend & API Agent Rules & Standards

> **Scope:** All files in `website/app/api/**` and `website/lib/mongodb.ts`

---

## 1. API Route Directives

### 1.1 Next.js 15 Route Handlers
* Export HTTP method functions directly (`GET`, `POST`, `PUT`, `DELETE`) with typed parameters:
  ```typescript
  import { NextRequest, NextResponse } from 'next/server';

  export const dynamic = 'force-dynamic';

  export async function GET(req: NextRequest) { ... }
  export async function POST(req: NextRequest) { ... }
  ```
* **Dynamic Forcing:** Use `export const dynamic = 'force-dynamic';` on routes reading headers, cookies, or database state to prevent static generation caching.

### 1.2 Graceful Offline & Fallback Handling
* Reel Analyzer can run in environments where MongoDB Atlas is not yet provisioned.
* **Mandatory Rule:** Never let an unconfigured or disconnected database crash API requests. Always check `if (!db)` and return graceful fallback payloads with `{ connected: false, ... }` and HTTP 200/503 accordingly.

---

## 2. MongoDB Operations & Schemas

### 2.1 Connection Singleton (`lib/mongodb.ts`)
* Reuse cached client connections across hot reloads and serverless invocations (`global._mongoClientPromise`).
* Always read connection URI strictly from `process.env.MONGODB_URI` and database name from `process.env.MONGODB_DB`.

### 2.2 Anonymous Visitor Tracking
* Never store plain IP addresses in database documents.
* Always mask IPs (e.g., `ip.substring(0, 8) + '...'`) and hash composite identities using SHA-256 (`crypto.createHash('sha256').update(`${ip}-${userAgent}`).digest('hex')`).
* Enforce 24-hour cookie deduplication (`last_visit_24h`) so page refreshes do not inflate unique visitor metrics.

### 2.3 Response Payloads
* Every response should return clean, predictable JSON with proper HTTP status codes:
  - `200`: Success with data.
  - `400`: Invalid client input or malformed JSON payload.
  - `500`: Unhandled server/database error with sanitized error message (no stack traces exposed to client).
