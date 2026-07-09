import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';

const emailRelayCode = `# Review relayed email through the server network
# Identify relay abuse, spam sources, and delivery failures

index=email sourcetype=maillog
| search action=relay OR action=send
| stats count by sender, recipient, action, status
| sort - count
| head 50

# Flag high-volume senders (potential abuse)
index=email sourcetype=maillog action=relay
| stats count as relay_count by sender, src_ip
| where relay_count > 500
| sort - relay_count

# Track delivery failures and bouncebacks
index=email sourcetype=maillog status=bounced OR status=deferred
| timechart span=1h count by status
| rename count as "Failures per Hour"`;

const incidentSearchCode = `# Trending incident detection — correlate alerts across the fleet
# Used during incident response to identify scope and root cause

index=syslog sourcetype=linux_messages
| search "error" OR "critical" OR "panic"
| timechart span=5m count as error_count
| where error_count > 50

# Correlate DDoS traffic spikes with server health
index=network sourcetype=firewall
| stats sum(bytes_in) as total_bytes by dest_ip
| where total_bytes > 1073741824
| sort - total_bytes
| eval total_GB = round(total_bytes / 1073741824, 2)
| table dest_ip, total_GB

# Root cause analysis — find the first occurrence of an error pattern
index=syslog host="affected-server-*"
| search "out of memory" OR "oom-killer"
| sort _time
| head 10
| table _time, host, _raw`;

const dashboardCode = `# Splunk dashboard XML — Server Health Overview
# Saved Search powering a real-time dashboard panel

<dashboard version="1.1">
  <label>Server Fleet Health</label>
  <row>
    <panel>
      <title>Error Rate — Last 24 Hours</title>
      <chart>
        <search>
          <query>
            index=syslog sourcetype=linux_messages
            ("error" OR "critical" OR "warning")
            | timechart span=1h count by log_level
          </query>
          <earliest>-24h@h</earliest>
          <latest>now</latest>
        </search>
        <option name="charting.chart">area</option>
        <option name="charting.chart.stackMode">stacked</option>
      </chart>
    </panel>
  </row>
</dashboard>`;

const Splunk = () => {
  useDocTitle('Splunk');
  const [activeTab, setActiveTab] = useState('email');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Splunk</h1>
        <p className={styles.heroTagline}>Log correlation and incident detection across a 100,000+ server network</p>
        <div className={styles.heroBadges}>
          {['SPL', 'Log Analysis', 'Incident Response', 'Dashboards', 'Email Relay', 'DDoS Detection'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It</h2>
          <p className={styles.sectionText}>
            Splunk is a core tool across four roles at GoDaddy. As a System Engineer, I use SPL daily to investigate
            incidents, review email server relays, and detect trending issues before they escalate. During DDoS events,
            Splunk is where I correlate traffic spikes with server health degradation to pinpoint affected hosts.
          </p>
          <p className={styles.sectionText}>
            I build saved searches and dashboards that track error patterns across the fleet, identify relay abuse in
            the email network, and surface root cause indicators during active incidents. Splunk is also my primary
            tool for post-incident analysis — reconstructing timelines from distributed log sources.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>100K+</div>
              <div className={styles.statLabel}>Servers Monitored</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>4</div>
              <div className={styles.statLabel}>Roles Using Splunk</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Capabilities</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Email relay review</strong> — Tracking relayed email across the server
            network using SPL to identify spam sources, delivery failures, and relay abuse patterns.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Trending incident detection</strong> — Building searches that identify
            recurring error patterns and surface them before they trigger customer-facing outages.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>DDoS correlation</strong> — Correlating network traffic data with
            server health metrics to determine attack scope and affected infrastructure.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> When investigating an incident, start with a broad time range and narrow down.
            Use <code>| timechart</code> first to see the shape of the problem, then <code>| stats</code> to drill
            into specific hosts or error types.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Fleet Monitoring</h2>
        <p className={styles.sectionText}>
          These SPL queries and dashboard configurations are representative of the searches I build and maintain
          for incident response and proactive monitoring.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['email', 'Email relay'], ['incident', 'Incident search'], ['dashboard', 'Dashboard XML']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#3b82f6' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>
            {activeTab === 'email' ? 'spl' : activeTab === 'incident' ? 'spl' : 'xml — dashboard'}
          </div>
          <SyntaxHighlighter
            language={activeTab === 'dashboard' ? 'xml' : 'bash'}
            style={vscDarkPlus}
            showLineNumbers
          >
            {activeTab === 'email' ? emailRelayCode : activeTab === 'incident' ? incidentSearchCode : dashboardCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Splunk;
