import React from 'react';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';
import CodeBlock from './CodeBlock';

const syncSitesCode = `#!/bin/bash
# Interactive deployment — rsync with per-site configuration
# Each entry: display_name|local_path|remote_path|excludes|server_override

SITES=(
    "AllADaStocks|sites/mini_bloomberg/|/var/www/mini_bloomberg|"
    "Resume|sites/Resume/|/var/www/resume/my-resume-app/|"
    "Recipes|sites/Recipes/|/var/www/recipes/|--exclude=logs"
    "Game Stats|sites/GameStats/|/var/www/gamestats/|"
    "Plex Dashboard|sites/Plex_App/plex-management-app/*|/var/www/plex-management-app/||darkness"
    # ... 17 more entries
)

build_command() {
    local local_path="$1" remote_path="$2" excludes="$3"
    local cmd="rsync -avzh --checksum --progress"
    cmd+=" --exclude=.env --exclude=.git*"
    cmd+=" --exclude=node_modules/ --exclude=venv/"
    cmd+=" --exclude=__pycache__/ --exclude=data/"
    [[ -n "$excludes" ]] && cmd+=" $excludes"
    cmd+=" $local_path \${target_server}:\${remote_path}"
    echo "$cmd"
}`;

const serviceUnitCode = `# Systemd unit with security hardening
[Unit]
Description=Web Application Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/app
ExecStart=/var/www/app/venv/bin/gunicorn \\
    --bind 127.0.0.1:5080 --workers 3 \\
    --max-requests 1000 \\
    backend.app:app
Restart=always
RestartSec=5

# Security hardening
ProtectSystem=strict
PrivateTmp=true
NoNewPrivileges=true
ProtectHome=true
CapabilityBoundingSet=
MemoryMax=2G
CPUQuota=80%
TasksMax=100
ReadWritePaths=/var/www/app/data /var/www/app/logs
ReadOnlyPaths=/var/www/app/backend /var/www/app/frontend`;

const errorWebhookCode = `# Centralized error ingestion — every app reports here
# Bearer-token auth, deduplication, age-gating, rate limiting

@api.route("/api/ingest", methods=["POST"])
@require_token
def ingest_error():
    payload = request.get_json()

    # Deduplicate by fingerprint (site + message + source)
    fingerprint = hashlib.sha256(
        f"{payload['site']}:{payload['message']}:{payload.get('source', '')}"
        .encode()
    ).hexdigest()[:16]

    existing = db.execute(
        "SELECT id FROM errors WHERE fingerprint = ? "
        "AND created_at > datetime('now', '-1 hour')",
        (fingerprint,)
    ).fetchone()

    if existing:
        db.execute(
            "UPDATE errors SET occurrence_count = occurrence_count + 1 "
            "WHERE id = ?", (existing["id"],)
        )
        return jsonify({"status": "deduplicated"}), 200

    db.execute(
        "INSERT INTO errors (site, message, source, fingerprint, severity) "
        "VALUES (?, ?, ?, ?, ?)",
        (payload["site"], payload["message"],
         payload.get("source"), fingerprint, payload.get("severity", "error"))
    )
    return jsonify({"status": "ingested"}), 201`;

const Homelab = () => {
  useDocTitle('Self-Hosted Infrastructure');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Self-Hosted Infrastructure</h1>
        <p className={styles.heroTagline}>
          22 applications across 3 servers — custom deployment, service management, and centralized monitoring
        </p>
        <div className={styles.heroBadges}>
          {['Linux', 'Systemd', 'Nginx', 'Rsync', 'Cloudflare Tunnels', 'DataTracker', 'pm2'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statBlock}>
            <div className={styles.statNum}>22</div>
            <div className={styles.statLabel}>Services</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNum}>3</div>
            <div className={styles.statLabel}>Servers</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNum}>20</div>
            <div className={styles.statLabel}>Systemd Units</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNum}>14</div>
            <div className={styles.statLabel}>Nginx Configs</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Automated Deployment Pipeline</h2>
        <p className={styles.sectionText}>
          Every application deploys through a single interactive script — select a site from the menu, and rsync
          handles the rest. Each site declares its own local path, remote path, server target, and per-site
          exclusions. Global exclusions strip development artifacts (<code>.git</code>, <code>node_modules</code>,
          <code>venv</code>, <code>__pycache__</code>) while per-site rules handle project-specific files. Multi-hop
          deploys chain across servers — the resume site syncs from the development machine to the primary server,
          then cascades to a secondary server.
        </p>
        <CodeBlock filename="sync-sites.sh" language="bash" code={syncSitesCode} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Hardened Service Management</h2>
        <p className={styles.sectionText}>
          Every backend runs as a systemd service with security hardening — filesystem protection, private tmp
          directories, capability restrictions, and memory limits. Services use virtual environments for Python
          isolation and declare explicit read/write paths. A companion restart script provides an interactive menu
          that knows every service's method (systemd, nginx, pm2), its ports, and its log commands.
        </p>
        <CodeBlock filename="service-unit.service" language="bash" code={serviceUnitCode} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Centralized Error Tracking</h2>
        <p className={styles.sectionText}>
          DataTracker is a custom-built observability platform — a Flask API with 27 route modules covering error
          ingestion, GitHub CI monitoring, Ollama telemetry, DNS leak detection, system metrics, VPN alerts, and
          security scanning. Every application reports errors via a webhook endpoint with bearer-token
          authentication, deduplication, and rate limiting. A separate collector daemon runs continuously,
          aggregating logs, monitoring GitHub workflows, and generating operational insights.
        </p>
        <blockquote className={styles.callout}>
          DataTracker replaces the need for Sentry, Datadog, or New Relic for a homelab — purpose-built error
          tracking, CI monitoring, and AI telemetry in a single self-hosted platform.
        </blockquote>
        <CodeBlock filename="error-webhook.py" language="python" code={errorWebhookCode} />
      </div>
    </div>
  );
};

export default Homelab;
