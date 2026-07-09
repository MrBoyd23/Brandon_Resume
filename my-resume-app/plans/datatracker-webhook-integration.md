# Brandon's Resume — DataTracker Webhook Integration ✅ COMPLETED 2026-06-01

## Context

DataTracker monitors Resume via nginx logs (static build). The Express backend has two API routes. This integration adds error reporting for both routes plus a global error middleware.

**Prerequisite**: DataTracker Phase 2 complete.

## Current State

- **File**: `server/server.js`
- **Routes**: `GET /api/resume` (PDF generation via Puppeteer), `POST /api/contact` (email via Nodemailer)
- **Error handler**: Inline try/catch per route. `console.error()` only. No global handler.

## Changes

### 1. Add `reportError()` helper

Add to `server/server.js`:

```javascript
const DT_URL = process.env.DATATRACKER_URL;
const DT_TOKEN = process.env.DATATRACKER_TOKEN;

function reportError(site, message, opts = {}) {
  if (!DT_URL || !DT_TOKEN) return;
  fetch(DT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DT_TOKEN}` },
    body: JSON.stringify({ site, level: "error", message, ...opts }),
  }).catch(() => {});
}
```

### 2. Add `reportError()` to existing catch blocks

In `GET /api/resume` catch:
```javascript
reportError("resume", err.message, {
  error_type: err.name, traceback: err.stack,
  context: { endpoint: "/api/resume", method: "GET" },
});
```

In `POST /api/contact` catch:
```javascript
reportError("resume", error.message, {
  error_type: error.name, traceback: error.stack,
  context: { endpoint: "/api/contact", method: "POST" },
});
```

### 3. Add global error middleware

After all routes:
```javascript
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  reportError("resume", err.message, {
    error_type: err.name, traceback: err.stack,
    context: { endpoint: req.path, method: req.method, ip: req.ip },
  });
  res.status(500).json({ error: 'Internal server error' });
});
```

### 4. Add env vars

Add to `.env`:
```
DATATRACKER_URL=http://localhost:5080/api/ingest
DATATRACKER_TOKEN=<token-from-datatracker>
```

## Effort

~25 lines

## Verification

1. Add env vars, restart server
2. Trigger errors in both routes
3. Verify errors appear in DataTracker
4. Unset `DATATRACKER_URL`, restart — verify site works normally
