import React, { useState } from 'react';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';
import CodeBlock from './CodeBlock';

const tunnelConfigCode = `# Cloudflare Tunnel — expose local services without port forwarding
# Used for WeddingSite (RJPJ2020) and Recipes Website

# Install cloudflared on the server
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \\
  -o /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared

# Authenticate with Cloudflare
cloudflared tunnel login

# Create a tunnel
cloudflared tunnel create rjpj2020

# Configure the tunnel (config.yml)
tunnel: <tunnel-id>
credentials-file: /root/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: rjpj2020.brandonaboyd.com
    service: http://localhost:3333
  - hostname: recipes.brandonaboyd.com
    service: http://localhost:3070
  - service: http_status:404

# Run the tunnel as a systemd service
cloudflared service install
systemctl enable cloudflared
systemctl start cloudflared`;

const rateLimitCode = `# Cloudflare WAF — Rate limiting rules
# Applied to protect API endpoints from abuse

# Rule 1: Contact form rate limiting
# Path: /api/contact
# Method: POST
# Rate: 5 requests per 10 seconds per IP
# Action: Block for 60 seconds

Expression:
  (http.request.uri.path eq "/api/contact"
   and http.request.method eq "POST")

Rate: 5 requests / 10 seconds
Counting: Per IP
Mitigation: Block (60s timeout)

# Rule 2: Resume PDF download throttling
# Prevent bots from hammering the PDF generator
Expression:
  (http.request.uri.path eq "/api/resume"
   and http.request.method eq "GET")

Rate: 3 requests / 60 seconds
Counting: Per IP
Mitigation: Challenge`;

const ddosTrackingCode = `# DDoS event tracking and mitigation workflow
# Patterns used at GoDaddy for MWPv2 and network-level protection

# 1. Detect — Kentik/Cloudflare flags anomalous traffic
#    Cloudflare dashboard shows:
#    - Traffic spike by country/ASN
#    - Request rate exceeding baseline
#    - Unusual HTTP method distribution

# 2. Analyze — Determine attack vector
#    Common patterns observed:
#    - Layer 7: HTTP flood (GET/POST to login endpoints)
#    - Layer 3/4: UDP amplification, SYN flood
#    - Application: Slowloris, XML-RPC abuse on WordPress

# 3. Mitigate — Apply Cloudflare rules
# Block traffic from specific ASNs during active attack
(ip.geoip.asnum in {12345 67890})

# Challenge suspicious traffic patterns
(http.request.uri.path contains "/xmlrpc.php")
or (http.request.uri.path contains "/wp-login.php"
    and http.request.method eq "POST"
    and not ip.geoip.country in {"US" "CA"})

# Under Attack Mode — JavaScript challenge for all visitors
# Enabled via API during active volumetric attacks
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/{zone_id}/settings/security_level" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  --data '{"value":"under_attack"}'`;

const Cloudflare = () => {
  useDocTitle('Cloudflare');
  const [activeTab, setActiveTab] = useState('tunnel');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Cloudflare</h1>
        <p className={styles.heroTagline}>Zero Trust tunnels, DDoS mitigation, and WAF protection across production sites</p>
        <div className={styles.heroBadges}>
          {['Cloudflare Tunnel', 'WAF', 'Rate Limiting', 'DDoS Mitigation', 'Zero Trust', 'DNS'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It</h2>
          <p className={styles.sectionText}>
            Cloudflare secures and exposes my production sites. Cloudflare Tunnel (Zero Trust) provides secure
            access to services running on the Automations server without opening firewall ports or configuring
            port forwarding — the tunnel connects outbound to Cloudflare's edge network.
          </p>
          <p className={styles.sectionText}>
            At GoDaddy, I worked with Cloudflare extensively for DDoS tracking and mitigation on the MWPv2
            platform. This included configuring WAF rate limiting rules, analyzing attack patterns, and
            coordinating network-level responses during active volumetric attacks.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>2</div>
              <div className={styles.statLabel}>Active Tunnels</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>DDoS</div>
              <div className={styles.statLabel}>Mitigation Experience</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Capabilities</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Zero Trust tunnels</strong> — Cloudflare Tunnel replaces traditional
            port forwarding. Services bind to localhost only — Cloudflare handles TLS, DNS, and edge routing.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>WAF rate limiting</strong> — Custom rules protect API endpoints.
            Contact forms, login pages, and PDF generators each get appropriate rate limits with IP-based counting.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>DDoS response</strong> — Real-time analysis of attack vectors using
            Cloudflare's analytics dashboard. ASN blocking, geo-restrictions, and Under Attack Mode deployed based
            on attack type.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Run <code>cloudflared service install</code> to register the tunnel as a systemd
            service. This way the tunnel auto-reconnects on server reboot without manual intervention.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Configurations</h2>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['tunnel', 'Tunnel setup'], ['ratelimit', 'Rate limiting'], ['ddos', 'DDoS mitigation']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#3b82f6' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <CodeBlock filename={activeTab === 'tunnel' ? 'tunnel setup' : activeTab === 'ratelimit' ? 'waf rules' : 'ddos response'} language="bash" code={activeTab === 'tunnel' ? tunnelConfigCode : activeTab === 'ratelimit' ? rateLimitCode : ddosTrackingCode} showLineNumbers />
      </div>
    </div>
  );
};

export default Cloudflare;
