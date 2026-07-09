import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';

const diagnosticCode = `-- MSSQL diagnostic queries — hosting server troubleshooting
-- Used during incident response to identify database-level issues

-- Check database status and recovery model
SELECT name, state_desc, recovery_model_desc, compatibility_level
FROM sys.databases
ORDER BY name;

-- Active connections and blocking queries
SELECT
    r.session_id,
    r.blocking_session_id,
    r.wait_type,
    r.wait_time / 1000.0 AS wait_seconds,
    t.text AS query_text,
    r.status,
    r.cpu_time,
    r.total_elapsed_time / 1000.0 AS elapsed_seconds
FROM sys.dm_exec_requests r
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
WHERE r.session_id > 50
ORDER BY r.total_elapsed_time DESC;

-- Database file sizes and growth settings
SELECT
    DB_NAME(database_id) AS database_name,
    name AS file_name,
    type_desc,
    size * 8 / 1024 AS size_mb,
    growth * 8 / 1024 AS growth_mb,
    max_size * 8 / 1024 AS max_size_mb
FROM sys.master_files
ORDER BY size DESC;`;

const backupRestoreCode = `-- MSSQL backup and restore operations
-- Common procedures for hosting server maintenance

-- Full database backup
BACKUP DATABASE [CustomerDB]
TO DISK = N'D:\\Backups\\CustomerDB_Full.bak'
WITH NOFORMAT, NOINIT,
     NAME = N'CustomerDB-Full',
     COMPRESSION,
     STATS = 10;

-- Transaction log backup (for point-in-time recovery)
BACKUP LOG [CustomerDB]
TO DISK = N'D:\\Backups\\CustomerDB_Log.trn'
WITH NOFORMAT, NOINIT,
     NAME = N'CustomerDB-Log',
     COMPRESSION,
     STATS = 10;

-- Restore database to a point in time
-- Step 1: Restore full backup with NORECOVERY
RESTORE DATABASE [CustomerDB_Restore]
FROM DISK = N'D:\\Backups\\CustomerDB_Full.bak'
WITH NORECOVERY,
     MOVE N'CustomerDB' TO N'D:\\Data\\CustomerDB_Restore.mdf',
     MOVE N'CustomerDB_log' TO N'D:\\Data\\CustomerDB_Restore_log.ldf';

-- Step 2: Restore log with STOPAT for point-in-time
RESTORE LOG [CustomerDB_Restore]
FROM DISK = N'D:\\Backups\\CustomerDB_Log.trn'
WITH RECOVERY,
     STOPAT = '2025-01-15T14:30:00';`;

const performanceCode = `-- MSSQL performance troubleshooting
-- Queries for identifying slow queries and resource bottlenecks

-- Top 10 most expensive queries by CPU
SELECT TOP 10
    qs.total_worker_time / qs.execution_count AS avg_cpu_time,
    qs.execution_count,
    SUBSTRING(qt.text, (qs.statement_start_offset/2) + 1,
        ((CASE qs.statement_end_offset
            WHEN -1 THEN DATALENGTH(qt.text)
            ELSE qs.statement_end_offset END
         - qs.statement_start_offset)/2) + 1) AS query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY qs.total_worker_time / qs.execution_count DESC;

-- Missing indexes — SQL Server's recommendations
SELECT
    d.statement AS table_name,
    d.equality_columns,
    d.inequality_columns,
    d.included_columns,
    s.user_seeks,
    s.avg_total_user_cost * s.avg_user_impact AS improvement_measure
FROM sys.dm_db_missing_index_details d
JOIN sys.dm_db_missing_index_groups g ON d.index_handle = g.index_handle
JOIN sys.dm_db_missing_index_group_stats s ON g.index_group_handle = s.group_handle
ORDER BY improvement_measure DESC;

-- Check for index fragmentation
SELECT
    DB_NAME() AS database_name,
    OBJECT_NAME(ips.object_id) AS table_name,
    i.name AS index_name,
    ips.avg_fragmentation_in_percent,
    ips.page_count
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE ips.avg_fragmentation_in_percent > 30
  AND ips.page_count > 1000
ORDER BY ips.avg_fragmentation_in_percent DESC;`;

const MSSQL = () => {
  useDocTitle('MSSQL');
  const [activeTab, setActiveTab] = useState('diagnostic');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>MSSQL / SQL Server</h1>
        <p className={styles.heroTagline}>Database troubleshooting and recovery across Windows hosting environments</p>
        <div className={styles.heroBadges}>
          {['T-SQL', 'Performance Tuning', 'Backup & Restore', 'DMVs', 'Index Analysis', 'Incident Response'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It</h2>
          <p className={styles.sectionText}>
            MSSQL troubleshooting has been part of my work in two roles at GoDaddy — System Engineer I and II.
            On a hosting platform with thousands of Windows servers, SQL Server issues are a common escalation
            point: blocked queries, database corruption, backup failures, and performance degradation.
          </p>
          <p className={styles.sectionText}>
            I use T-SQL and Dynamic Management Views (DMVs) to diagnose issues remotely. Common workflows include
            identifying blocking chains during outages, performing point-in-time restores for data recovery, and
            analyzing index fragmentation for performance complaints.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>2</div>
              <div className={styles.statLabel}>Roles Using MSSQL</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>T-SQL</div>
              <div className={styles.statLabel}>Primary Language</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Skills</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Diagnostic queries</strong> — Using DMVs to identify active
            connections, blocking sessions, resource usage, and database health during incidents.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Backup and restore</strong> — Full and transaction log backups,
            point-in-time recovery for customer data loss scenarios, and database migration between servers.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Performance analysis</strong> — Identifying expensive queries,
            missing indexes, and fragmentation issues. Using SQL Server's own recommendations to guide index
            creation decisions.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> When troubleshooting a slow database, check <code>sys.dm_exec_requests</code>
            for blocking chains first. A single blocked query can cascade into dozens of waiting sessions — fixing
            the head blocker resolves everything downstream.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Queries</h2>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['diagnostic', 'Diagnostics'], ['backup', 'Backup & restore'], ['performance', 'Performance']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#3b82f6' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>sql — t-sql</div>
          <SyntaxHighlighter language="sql" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'diagnostic' ? diagnosticCode : activeTab === 'backup' ? backupRestoreCode : performanceCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default MSSQL;
