# ⚙️ Backend Architecture & Database Guide

---

## 1. Overview & Principles

The backend of Reel Analyzer Web consists of Next.js 15 App Router Route Handlers connected to **MongoDB Atlas**.
* **Stateless Handlers:** All routes run as isolated, stateless functions (`export const dynamic = 'force-dynamic';`).
* **Zero PII Storage:** No personal user notes, passwords, or raw IP addresses are ever stored.
* **Offline Resilience:** If MongoDB Atlas is unavailable or `MONGODB_URI` is unset, the routes return safe fallback objects without throwing 500 errors.

---

## 2. API Endpoints Contract

### 2.1 Analytics & Visitor Tracking: `/api/analytics/view`

#### `GET /api/analytics/view`
Fetches global unique visitor statistics and 24-hour active visitor count.
* **Response `200 OK`:**
  ```json
  {
    "connected": true,
    "uniqueVisitors": 1420,
    "totalPageViews": 4260,
    "todayUnique": 38,
    "source": "mongodb_atlas"
  }
  ```
* **Offline Fallback Response `200 OK`:**
  ```json
  {
    "connected": false,
    "uniqueVisitors": 0,
    "totalPageViews": 0,
    "todayUnique": 1,
    "source": "local_baseline"
  }
  ```

#### `POST /api/analytics/view`
Records a unique visitor hit using SHA-256 fingerprinting.
* **Headers Used:** `x-forwarded-for`, `x-real-ip`, `user-agent`.
* **Cookie Set:** `last_visit_24h` (HTTP-Only, 24-hour expiration).
* **Processing Logic:**
  1. Computes SHA-256 hash of `ip + userAgent`.
  2. Masks IP string to first 8 characters + `...`.
  3. Checks `last_visit_24h` cookie. If valid (<24h), skips incrementing daily unique counter.
  4. Upserts record into `unique_visitors` collection and increments `site_metrics.totalPageViews`.

---

### 2.2 Creator Feedback & Survey Collector: `/api/feedback`

#### `POST /api/feedback`
Receives user feedback, creator messages, and uninstallation surveys.
* **Request Body:**
  ```json
  {
    "type": "creator_message", // or "uninstall_survey"
    "message": "Love the Obsidian export feature!",
    "reason": "optional_reason_string",
    "rating": 5,
    "senderEmail": "optional_email@example.com"
  }
  ```
* **Target Collections:**
  - `type === 'uninstall_survey'` &rarr; `uninstall_surveys` collection.
  - `type === 'creator_message'` &rarr; `creator_messages` collection.
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "persisted": true
  }
  ```

---

### 2.3 Local Vault Snapshot & MCP Sync: `/api/vault/sync`

#### `GET /api/vault/sync`
Returns all current reels saved in the local JSON snapshot (`data/vault.json`).
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "count": 12,
    "reels": [...]
  }
  ```

#### `POST /api/vault/sync`
Receives reels payload from the browser dashboard (via `content_bridge.js`) or local sync, merges without destructive loss by reel URL, and updates `data/vault.json`.
* **Request Body:**
  ```json
  {
    "reels": [ ...ReelItem[] ]
  }
  ```
* **Response `200 OK`:**
  ```json
  {
    "success": true,
    "totalCount": 14,
    "syncedAt": "2026-10-23T11:45:00.000Z"
  }
  ```

---

## 3. Database Schema Models (`reel_analyzer`)

### Collection: `unique_visitors`
```typescript
interface UniqueVisitorDoc {
  _id: ObjectId;
  visitorHash: string;      // SHA-256(ip + userAgent)
  userAgent: string;        // Browser user agent
  ip: string;               // Privacy-masked IP (e.g. "123.45.6...")
  firstSeen: Date;          // First visit timestamp
  lastSeen: Date;           // Most recent visit timestamp
  visitCount: number;       // Lifetime visit count
}
```

### Collection: `site_metrics`
```typescript
interface SiteMetricsDoc {
  _id: "global";            // Singleton ID
  totalPageViews: number;   // Total accumulated page views
}
```

### Collection: `creator_messages`
```typescript
interface CreatorMessageDoc {
  _id: ObjectId;
  type: "creator_message";
  message: string;
  senderEmail: string;
  userAgent: string;
  createdAt: Date;
}
```

### Collection: `uninstall_surveys`
```typescript
interface UninstallSurveyDoc {
  _id: ObjectId;
  type: "uninstall_survey";
  reason: string;
  rating: number;
  message: string;
  userAgent: string;
  createdAt: Date;
}
```

---

## 4. Connection Pooling (`lib/mongodb.ts`)

MongoDB client caching pattern to prevent socket exhaustion during Next.js hot-reloading:
```typescript
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}
```
