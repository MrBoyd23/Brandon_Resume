import React, { useState } from 'react';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';
import CodeBlock from './CodeBlock';

const buildDeployCode = `# GitHub Actions — Build and deploy React app
# Triggered on push to main, builds and syncs to production

name: Build & Deploy Resume
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --watchAll=false

      - name: Build production bundle
        run: npm run build
        env:
          REACT_APP_RECAPTCHA_SITE_KEY: \${{ secrets.RECAPTCHA_SITE_KEY }}

      - name: Deploy to server
        uses: burnett01/rsync-deployments@7.0.1
        with:
          switches: -avz --delete
          path: build/
          remote_path: /var/www/resume/my-resume-app/build/
          remote_host: \${{ secrets.DEPLOY_HOST }}
          remote_user: \${{ secrets.DEPLOY_USER }}
          remote_key: \${{ secrets.DEPLOY_SSH_KEY }}`;

const ciTestingCode = `# GitHub Actions — CI testing pipeline
# Runs on all pull requests to catch issues before merge

name: CI Tests
on:
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check for lint errors
        run: npx eslint src/ --max-warnings 0

      - name: Run test suite
        run: npm test -- --watchAll=false --coverage
        env:
          CI: true

      - name: Upload coverage report
        if: matrix.node-version == 20
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/`;

const scheduledCode = `# GitHub Actions — Scheduled maintenance tasks
# Automated dependency checks and build verification

name: Weekly Maintenance
on:
  schedule:
    # Run every Monday at 6 AM UTC
    - cron: '0 6 * * 1'
  workflow_dispatch:  # Allow manual trigger

jobs:
  dependency-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Audit for vulnerabilities
        run: npm audit --audit-level=high
        continue-on-error: true

      - name: Check for outdated packages
        run: npm outdated || true

      - name: Verify build still works
        run: npm run build

      - name: Notify on failure
        if: failure()
        run: |
          echo "Build or audit failed — check the workflow logs"
          # Could integrate with Slack/Discord webhook here`;

const GitHubWorkflows = () => {
  useDocTitle('GitHub Workflows');
  const [activeTab, setActiveTab] = useState('build');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>GitHub Workflows</h1>
        <p className={styles.heroTagline}>Automated build, test, and deploy pipelines for portfolio projects</p>
        <div className={styles.heroBadges}>
          {['GitHub Actions', 'CI/CD', 'Automated Testing', 'YAML', 'Build Pipeline', 'Scheduled Jobs'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It</h2>
          <p className={styles.sectionText}>
            I configure GitHub Actions workflows for automated builds, testing, and deployment across my portfolio
            projects. Each push to main triggers a build pipeline that installs dependencies, runs tests, creates
            a production bundle, and syncs the output to the production server.
          </p>
          <p className={styles.sectionText}>
            Pull requests run a separate CI pipeline with linting and test coverage. Scheduled workflows handle
            weekly dependency audits and build verification — catching issues before they block a deploy.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>CI/CD</div>
              <div className={styles.statLabel}>Pipeline Type</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>YAML</div>
              <div className={styles.statLabel}>Configuration</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Workflow Patterns</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Build and deploy</strong> — Push-triggered pipeline: checkout,
            install, test, build, rsync to production. Environment secrets keep credentials out of the repo.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>CI testing</strong> — Matrix strategy tests across Node.js
            versions. ESLint catches code quality issues, Jest runs the test suite with coverage reporting.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Scheduled maintenance</strong> — Weekly cron jobs audit
            dependencies for vulnerabilities, check for outdated packages, and verify the build still succeeds.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Use <code>npm ci</code> instead of <code>npm install</code> in CI pipelines.
            It's faster, stricter (fails on lockfile mismatches), and produces reproducible builds — exactly
            what you want in automated workflows.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Workflows</h2>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['build', 'Build & deploy'], ['ci', 'CI testing'], ['scheduled', 'Scheduled']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#3b82f6' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <CodeBlock filename=".github/workflows/" language="yaml" code={activeTab === 'build' ? buildDeployCode : activeTab === 'ci' ? ciTestingCode : scheduledCode} showLineNumbers />
      </div>
    </div>
  );
};

export default GitHubWorkflows;
