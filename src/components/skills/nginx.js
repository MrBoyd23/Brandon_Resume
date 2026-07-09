import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';

const spaRoutingCode = `# Nginx config — React SPA with HTML5 history routing
# Serves the static build and falls back to index.html for client-side routes

server {
    listen 3500;
    server_name brandonaboyd.com;

    root /var/www/resume/my-resume-app/build;
    index index.html;

    # SPA fallback — all non-file requests serve index.html
    # React Router handles the route on the client side
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively (hashed filenames = safe to cache)
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Serve pre-built PDF resume directly
    location = /Brandon_Boyd_Resume.pdf {
        add_header Content-Disposition "attachment; filename=Brandon_Boyd_Resume.pdf";
        add_header Cache-Control "no-store";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 256;
}`;

const reverseProxyCode = `# Nginx reverse proxy — Flask backend behind nginx
# Pattern used across GameStats, JobSearch, UXDESIGN, and other projects

upstream flask_backend {
    server 127.0.0.1:5010;
    keepalive 4;
}

server {
    listen 3010;
    server_name gamestats.local;

    # Proxy API requests to Flask
    location / {
        proxy_pass http://flask_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Serve static files directly — bypass Flask
    location /static/ {
        alias /var/www/gamestats/frontend/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Rate limiting for API endpoints
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://flask_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`;

const securityCode = `# Nginx security hardening — production configuration
# Applied across all sites on the Automations server

# Rate limiting zones (defined in http block)
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=3r/s;

# SSL configuration (sites behind Cloudflare Tunnel)
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;

# Block common scanner paths
location ~* /(wp-admin|wp-login|xmlrpc|\.env|\.git|phpmyadmin) {
    return 444;
}

# Block bad user agents
if ($http_user_agent ~* (bot|crawl|spider|scan|sqlmap|nikto)) {
    return 403;
}

# Deny access to hidden files
location ~ /\\. {
    deny all;
    access_log off;
    log_not_found off;
}`;

const Nginx = () => {
  useDocTitle('Nginx');
  const [activeTab, setActiveTab] = useState('spa');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Nginx</h1>
        <p className={styles.heroTagline}>Production web server powering 15+ sites across multiple servers</p>
        <div className={styles.heroBadges}>
          {['Reverse Proxy', 'SPA Routing', 'Gzip', 'Rate Limiting', 'SSL', 'Security Headers'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It</h2>
          <p className={styles.sectionText}>
            Nginx is the production web server for every site in my portfolio. For static sites and React SPAs,
            it serves build output with HTML5 history fallback so client-side routing works on direct URL access
            and page refresh. For Flask and Express backends, it acts as a reverse proxy with upstream keepalive
            connections.
          </p>
          <p className={styles.sectionText}>
            I configure nginx across two servers — Automations (hosting 15+ sites) and BrandonBoyd (secondary
            deploy target). Each site gets its own server block with appropriate caching, compression, and
            security headers. Rate limiting protects API endpoints from abuse.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>15+</div>
              <div className={styles.statLabel}>Sites Served</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>2</div>
              <div className={styles.statLabel}>Production Servers</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Configuration Patterns</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>SPA routing</strong> — <code>try_files $uri $uri/ /index.html</code>
            ensures React Router handles all client-side routes while nginx serves static assets directly.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Reverse proxy</strong> — Flask and Express backends run on internal
            ports. Nginx proxies requests, adds forwarded headers, and serves static files directly to reduce
            backend load.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Security hardening</strong> — Scanner path blocking, bad user agent
            filtering, hidden file denial, and security headers applied globally across all sites.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Use <code>expires 1y</code> with <code>immutable</code> for hashed static
            assets (like React's <code>/static/js/main.abc123.js</code>). The hash changes on rebuild, so
            aggressive caching is safe and eliminates unnecessary revalidation requests.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Configurations</h2>
        <p className={styles.sectionText}>
          These configurations are drawn from the production nginx setup across my portfolio sites.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['spa', 'SPA routing'], ['proxy', 'Reverse proxy'], ['security', 'Security']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#3b82f6' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>nginx.conf</div>
          <SyntaxHighlighter language="nginx" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'spa' ? spaRoutingCode : activeTab === 'proxy' ? reverseProxyCode : securityCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Nginx;
