# Brandon's Resume — DataTracker Heartbeat Integration

## Context

DataTracker needs a periodic heartbeat from each integrated site to detect when a webhook
connection goes down.

**Prerequisite**: Webhook integration complete (reportError in `server/server.js`).

## Current State

- **Webhook code**: Check `server/server.js` for `DATATRACKER_URL`, `DATATRACKER_TOKEN`,
  `reportError()` function and global error middleware
- **Site slug**: `resume`
- **Runtime**: Node.js / Express

## Changes

### 1. Add heartbeat to `server/server.js`

After the existing DataTracker webhook setup:

```javascript
const DT_URL = process.env.DATATRACKER_URL;
const DT_TOKEN = process.env.DATATRACKER_TOKEN;

if (DT_URL && DT_TOKEN) {
  const hbUrl = DT_URL.replace(/\/ingest$/, "/heartbeat");
  setInterval(() => {
    fetch(hbUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${DT_TOKEN}` },
      body: JSON.stringify({ site: "resume" }),
    }).catch(() => {});
  }, 300000); // 5 minutes
}
```

## Verification

1. Restart the Resume Express server on the server
2. Check DataTracker Integrations page — Resume should show "Connected" within 5 minutes
