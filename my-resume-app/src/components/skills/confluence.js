import React from 'react';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';

const Confluence = () => {
  useDocTitle('Confluence');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Confluence</h1>
        <p className={styles.heroTagline}>Enterprise documentation and knowledge management across four roles</p>
        <div className={styles.heroBadges}>
          {['Knowledge Base', 'SOPs', 'Runbooks', 'Atlassian', 'Documentation', 'Team Collaboration'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It</h2>
          <p className={styles.sectionText}>
            Confluence has been my primary documentation platform across four roles at GoDaddy — from SME | Website
            Security through System Engineer III. I create and maintain operational SOPs, troubleshooting runbooks,
            onboarding guides, and post-incident reviews. Documentation excellence is a core competency in my
            current role.
          </p>
          <p className={styles.sectionText}>
            I use Confluence as a living knowledge base, not a document archive. Pages are structured for
            searchability, linked to related Jira tickets, and updated when processes change. My documentation
            work has been recognized as a key factor in team operational readiness.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>4</div>
              <div className={styles.statLabel}>Roles Using Confluence</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>SME</div>
              <div className={styles.statLabel}>Documentation Standard</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Documentation Practices</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Operational SOPs</strong> — Step-by-step procedures for recurring
            operations: incident escalation paths, server provisioning, security review checklists. Written so any
            team member can execute them without prior context.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Troubleshooting runbooks</strong> — Decision-tree-style guides for
            common issues. Start with symptoms, branch to diagnostic steps, end with resolution actions. Linked to
            Splunk saved searches and Grafana dashboards where applicable.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Onboarding materials</strong> — Structured learning paths for new
            team members covering tooling, access setup, common workflows, and escalation procedures. Reduces
            ramp-up time and ensures consistent knowledge transfer.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Post-incident reviews</strong> — Templated write-ups that capture
            timeline, root cause, impact, and action items. Cross-linked to Jira tickets for tracking remediation.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Structure pages for scanning, not reading. Use headers, tables, and callout
            macros. An engineer at 2 AM during an incident needs to find the right procedure in 10 seconds — wall
            of text documentation fails that test.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Documentation Types I Maintain</h2>
        <div className={styles.twoCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Operational</h2>
            <ul className={styles.featureList}>
              <li>Incident escalation procedures</li>
              <li>Server provisioning checklists</li>
              <li>Network violation review process</li>
              <li>DDoS response playbook</li>
              <li>Change management procedures</li>
            </ul>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Technical</h2>
            <ul className={styles.featureList}>
              <li>WordPress server configuration guides</li>
              <li>Email relay troubleshooting steps</li>
              <li>SSL certificate renewal process</li>
              <li>Application pool diagnostics</li>
              <li>Malware identification and removal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confluence;
