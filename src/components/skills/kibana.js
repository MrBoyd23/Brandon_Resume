import React from 'react';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';

const Kibana = () => {
  useDocTitle('Kibana');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Kibana</h1>
        <p className={styles.heroTagline}>Data visualization and DDoS event tracking in the Elastic Stack</p>
        <div className={styles.heroBadges}>
          {['Dashboards', 'Visualizations', 'DDoS Tracking', 'Elastic Stack', 'KQL', 'Time Series'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It</h2>
          <p className={styles.sectionText}>
            I use Kibana to build visualizations for network traffic analysis and DDoS event tracking. At GoDaddy,
            I created Kibana dashboards that graph DDoS attack patterns — traffic volume over time, attack vectors,
            targeted IPs, and geographic distribution of source traffic.
          </p>
          <p className={styles.sectionText}>
            Kibana pairs with Elasticsearch for log aggregation across the server fleet. During incidents, I use
            KQL (Kibana Query Language) to filter and correlate events across multiple data sources, identifying
            attack scope and progression in real-time.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>DDoS</div>
              <div className={styles.statLabel}>Primary Use Case</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>KQL</div>
              <div className={styles.statLabel}>Query Language</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Capabilities</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>DDoS event dashboards</strong> — Time series visualizations of
            attack traffic: bytes per second, packet rates, and connection counts. Color-coded by attack vector
            (SYN flood, UDP amplification, HTTP flood) for rapid classification.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Traffic pattern analysis</strong> — Geographic heat maps showing
            source traffic distribution. Useful for identifying botnets and determining whether to apply
            geo-based blocking rules during active attacks.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Correlation across sources</strong> — Combining network flow data,
            firewall logs, and server health metrics in a single dashboard to see the full picture during an
            incident — from traffic spike to server impact.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Save your incident investigation queries as Kibana saved objects. During a
            DDoS event, you don't want to be writing queries from scratch — load the saved dashboard, adjust the
            time range, and you're immediately in the data.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Dashboard Components</h2>
        <div className={styles.twoCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>DDoS Tracking</h2>
            <ul className={styles.featureList}>
              <li>Traffic volume time series (bytes/sec, packets/sec)</li>
              <li>Attack vector classification panels</li>
              <li>Geographic source heat maps</li>
              <li>Top targeted destination IPs</li>
              <li>ASN-level traffic breakdown</li>
            </ul>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Operational</h2>
            <ul className={styles.featureList}>
              <li>Server error rate trending</li>
              <li>Network throughput by interface</li>
              <li>Firewall rule hit counters</li>
              <li>Connection state distribution</li>
              <li>Anomaly detection alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kibana;
