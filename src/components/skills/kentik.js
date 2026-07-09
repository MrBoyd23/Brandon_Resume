import React from 'react';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';

const Kentik = () => {
  useDocTitle('Kentik');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Kentik</h1>
        <p className={styles.heroTagline}>Network traffic intelligence and trend analysis at scale</p>
        <div className={styles.heroBadges}>
          {['Network Analytics', 'Flow Data', 'Traffic Trends', 'DDoS Detection', 'Capacity Planning'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It</h2>
          <p className={styles.sectionText}>
            As a System Engineer II at GoDaddy, I engaged with Kentik to track trends in network traffic across
            the hosting infrastructure. Kentik ingests flow data (NetFlow, sFlow, IPFIX) from network devices and
            provides real-time visibility into traffic patterns, anomalies, and capacity utilization.
          </p>
          <p className={styles.sectionText}>
            I use Kentik for both proactive monitoring and reactive incident response. Proactively, it surfaces
            traffic trends that indicate growing demand or shifting patterns before they become capacity issues.
            Reactively, during DDoS events, Kentik's flow analysis helps identify attack traffic characteristics
            and verify that mitigation rules are effective.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>NetFlow</div>
              <div className={styles.statLabel}>Data Source</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>Real-time</div>
              <div className={styles.statLabel}>Traffic Analysis</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Capabilities</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Traffic trend analysis</strong> — Tracking network utilization
            over time to identify growth patterns, seasonal peaks, and shifts in traffic composition. This data
            feeds into capacity planning decisions.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>DDoS detection</strong> — Kentik's anomaly detection flags
            traffic spikes that deviate from baseline patterns. When a DDoS event is detected, flow-level data
            shows source IPs, ASNs, protocols, and packet sizes for mitigation targeting.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Cross-platform correlation</strong> — Kentik traffic data combined
            with Splunk logs and Grafana server metrics provides a full-stack view: network layer traffic
            patterns mapped to application-layer impact on specific servers.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Use Kentik's Data Explorer to build custom traffic queries before
            creating dashboards. Once you've found the right filters and groupings, save them as dashboard
            panels — this avoids cluttering dashboards with exploratory visualizations.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Analysis Areas</h2>
        <div className={styles.twoCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Proactive</h2>
            <ul className={styles.featureList}>
              <li>Traffic volume trending by interface</li>
              <li>Top talkers and top destinations</li>
              <li>Protocol distribution shifts</li>
              <li>Capacity utilization forecasting</li>
              <li>Peering and transit traffic ratios</li>
            </ul>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Incident Response</h2>
            <ul className={styles.featureList}>
              <li>DDoS attack source identification</li>
              <li>Attack vector classification</li>
              <li>Mitigation rule effectiveness verification</li>
              <li>Traffic baseline deviation analysis</li>
              <li>Post-incident traffic normalization tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kentik;
