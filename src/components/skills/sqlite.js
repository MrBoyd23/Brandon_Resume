import React from 'react';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';
import CodeBlock from './CodeBlock';

const connectionSetupCode = `# Production SQLite setup — WAL mode, tuned pragmas, retry wrapper
import sqlite3, time, random

def get_connection(db_path):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=5000")
    conn.execute("PRAGMA synchronous=NORMAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.execute("PRAGMA wal_autocheckpoint=1000")
    return conn

def commit_with_retry(conn, max_retries=5):
    """Exponential backoff on 'database is locked' errors."""
    for attempt in range(max_retries):
        try:
            conn.commit()
            return
        except sqlite3.OperationalError as e:
            if "database is locked" not in str(e) or attempt == max_retries - 1:
                raise
            wait = (0.1 * (2 ** attempt)) + random.uniform(0, 0.05)
            time.sleep(wait)  # ~3.1s total window`;

const migrationsCode = `# Decorator-based migrations using PRAGMA user_version
MIGRATIONS = []

def migration(version):
    def decorator(fn):
        MIGRATIONS.append((version, fn))
        return fn
    return decorator

@migration(1)
def _v1_create_tables(db):
    db.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY,
            league TEXT NOT NULL,
            teams TEXT NOT NULL,
            bet_type TEXT NOT NULL,
            pick TEXT, confidence TEXT,
            result TEXT, resolved_at TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

@migration(2)
def _v2_add_indexes(db):
    db.execute("CREATE INDEX IF NOT EXISTS idx_pred_league "
               "ON predictions(league)")
    db.execute("CREATE INDEX IF NOT EXISTS idx_pred_created "
               "ON predictions(created_at)")

def run_migrations(db):
    current = db.execute("PRAGMA user_version").fetchone()[0]
    for version, fn in sorted(MIGRATIONS):
        if version > current:
            fn(db)
            db.execute(f"PRAGMA user_version = {version}")
            db.commit()

def maintenance(db):
    db.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    db.execute("PRAGMA optimize")
    db.execute("VACUUM")`;

const advancedQueriesCode = `-- 3-tier deduplication: exact URL → normalized URL → fuzzy title
-- Prevents duplicate articles from appearing across social platforms

-- Tier 1: Exact URL match
SELECT id FROM posted WHERE url = ? AND platform = ?;

-- Tier 2: Normalized URL (strip tracking params, trailing slash)
SELECT id FROM posted
WHERE normalized_url = ?
  AND platform = ?
  AND posted_at > datetime('now', '-30 days');

-- Tier 3: Fuzzy title match (application-level similarity >= 0.80)
SELECT id, title FROM posted
WHERE platform = ?
  AND posted_at > datetime('now', '-7 days');

-- Window functions for CI health monitoring
SELECT repo_name, workflow_name, conclusion, updated_at
FROM (
    SELECT *, ROW_NUMBER() OVER (
        PARTITION BY repo_name, workflow_name
        ORDER BY updated_at DESC
    ) AS rn
    FROM github_workflow_runs
)
WHERE rn = 1 AND conclusion IN ('failure', 'cancelled');

-- Time-bucketed retention (per-table schedules)
DELETE FROM system_metrics
WHERE recorded_at < datetime('now', '-2 days');

DELETE FROM ollama_snapshots
WHERE recorded_at < datetime('now', '-7 days');`;

const Sqlite = () => {
  useDocTitle('SQLite');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>SQLite</h1>
        <p className={styles.heroTagline}>Production database for 8 applications — WAL mode, schema migrations, and embedded analytics</p>
        <div className={styles.heroBadges}>
          {['SQLite', 'WAL Mode', 'better-sqlite3', 'Python sqlite3', 'Schema Design', 'Migrations', 'Analytics'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Production-Grade Connection Setup</h2>
        <p className={styles.sectionText}>
          Every SQLite database in the portfolio runs in WAL mode with tuned pragmas — busy timeouts for concurrent
          access, synchronous=NORMAL for write performance without sacrificing durability, and foreign key
          enforcement. A retry wrapper handles transient "database is locked" errors with exponential backoff,
          giving concurrent writers a 3-second window to resolve contention rather than failing immediately.
        </p>
        <CodeBlock filename="connection-setup.py" language="python" code={connectionSetupCode} />
        <div className={styles.statsRow}>
          <div className={styles.statBlock}>
            <div className={styles.statNum}>8</div>
            <div className={styles.statLabel}>Projects</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNum}>WAL</div>
            <div className={styles.statLabel}>Journal Mode</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNum}>0</div>
            <div className={styles.statLabel}>DB Servers</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Decorator-Based Migrations</h2>
        <p className={styles.sectionText}>
          Schema migrations use a decorator pattern with SQLite's PRAGMA user_version as the version tracker — no
          migration framework, no migration table, just the database's built-in version counter. Each migration is
          a decorated function that runs exactly once, in order. A maintenance routine handles WAL checkpointing,
          query optimization, and vacuum on a schedule.
        </p>
        <CodeBlock filename="migrations.py" language="python" code={migrationsCode} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Fuzzy Deduplication &amp; Analytics</h2>
        <p className={styles.sectionText}>
          SQLite handles more than just CRUD. The article aggregator uses a three-tier deduplication pipeline —
          exact URL match, normalized URL match (stripping tracking parameters), and fuzzy title matching with a
          similarity threshold. The error tracking platform uses window functions to surface the latest CI run per
          repository and time-bucketed retention policies that age out old data on different schedules per table.
        </p>
        <CodeBlock filename="advanced-queries.sql" language="sql" code={advancedQueriesCode} />
        <blockquote className={styles.callout}>
          Zero database servers to maintain. SQLite files live alongside the applications they serve — backed up
          with hot-copy APIs, checkpointed on schedule, and fast enough for every use case in the portfolio.
        </blockquote>
      </div>
    </div>
  );
};

export default Sqlite;
