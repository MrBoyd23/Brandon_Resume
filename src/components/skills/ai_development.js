import React from 'react';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';
import CodeBlock from './CodeBlock';

const claudeCodeExample = `# Claude Code — AI-assisted development across 18+ projects
# Real workflow: Jira MCP integration, multi-file refactors, test generation

# Claude Code reads Jira tickets via MCP, implements the change,
# runs the test suite, and updates the ticket — all in one session.
#
# Example session (this resume site):
#   1. Read THALAB-1094 from Jira MCP
#   2. Create Express redirect endpoint + SQLite scan logging
#   3. Build QR code React component with responsive CSS
#   4. Update nginx proxy config and Vite dev proxy
#   5. Run full build + verify routes in browser
#   6. Commit, create PR, merge, transition ticket to Done
#
# Skills used across projects:
#   - Custom skill files (.claude/skills/) synced to 5 servers
#   - CLAUDE.md per-project instructions for conventions
#   - MCP servers: Atlassian (Jira), Playwright (browser testing),
#     Cloudflare (DNS/tunnels), Context7 (library docs)`;

const toolCallingExample = `// Native Ollama tool calling — AI chatbot with live infrastructure data
// The model decides WHICH tools to call and HOW to interpret results

const TOOL_REGISTRY = {
  get_disk_usage: {
    service: "storage",
    params: { pool: { type: "string", required: false } },
    validate: async ({ pool }) => {
      const pools = await fetchPools();
      return pools.find(p => p.name === pool) ? true : "Pool not found";
    },
    execute: async ({ pool }) => await storageAPI.getUsage(pool),
    requiresConfirmation: false,  // read-only
  },

  restart_service: {
    service: "management",
    params: { name: { type: "string", required: true } },
    execute: async ({ name }) => await serviceAPI.restart(name),
    requiresConfirmation: true,   // destructive — user must confirm
  },
};

// Multi-round tool loop with time budget
async function toolLoop(messages, tools, timeout) {
  while (hasTimeBudget(timeout)) {
    const response = await ollama.chat({ messages, tools });

    if (!response.message.tool_calls?.length) break;

    for (const call of response.message.tool_calls) {
      const tool = TOOL_REGISTRY[call.function.name];
      if (tool.requiresConfirmation) {
        return { needsConfirmation: true, action: call };
      }
      const result = await tool.execute(call.function.arguments);
      messages.push({ role: "tool", content: JSON.stringify(result) });
    }
  }
  return { response: messages.at(-1).content };
}`;

const multiProviderExample = `# Multi-provider AI architecture — 8 apps, 3 model tiers, 1 GPU
# Each application configures its own model preferences and fallback chain

import os

# Provider configuration per application
OLLAMA_URL = os.getenv("OLLAMA_URL")  # shared instance
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
OLLAMA_FALLBACK_CHAIN = os.getenv("OLLAMA_FALLBACK_CHAIN", "").split(",")

# Application-specific routing:
#   GameStats  → llama3.1:8b  (deep analysis, betting projections)
#   Recipes    → deepseek-r1:7b (reasoning), qwen2.5:7b, llama3.2:3b (tagging)
#   JobSearch  → llama3.2:3b  (fast cover letters)
#   Plex       → qwen2.5:7b  (tool-calling chatbot)

# Centralized telemetry — every AI call logged to DataTracker
def report_ai_job(status, model, use_case, **kwargs):
    requests.post(f"{DATATRACKER_URL}/api/ingest", json={
        "site": APP_NAME,
        "message": f"ollama:{status}",
        "metadata": {
            "model": model,
            "use_case": use_case,
            "latency_ms": kwargs.get("latency_ms"),
            "tokens": kwargs.get("tokens"),
        },
    }, headers={"Authorization": f"Bearer {DATATRACKER_TOKEN}"},
    timeout=3)`;

const AIDevelopment = () => {
  useDocTitle('AI Development');
  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>AI Development</h1>
        <p className={styles.heroTagline}>8 production AI applications — from Claude Code workflows to self-hosted model fleets</p>
        <div className={styles.heroBadges}>
          {['Claude Code', 'Ollama', 'MCP Tools', 'Tool Calling', 'Multi-Provider', 'Python', 'Node.js', 'Jira MCP'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Claude Code & AI-Assisted Development</h2>
        <p className={styles.sectionText}>
          Every project in the portfolio is built and maintained with Claude Code — not as a copilot for autocomplete,
          but as an autonomous development agent. Custom skill files define project conventions, CLAUDE.md files
          set per-repo rules, and MCP servers connect Claude to Jira, Playwright, Cloudflare, and live documentation.
          A typical session reads a Jira ticket, implements the change across multiple files, runs the test suite,
          creates the PR, and transitions the ticket to Done.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: 'var(--accent-soft)' }}>Custom Skills</strong> — 15+ skill files covering Git workflows,
          Jira lifecycle management, web development patterns, security hardening, and systematic debugging — synced
          to 5 servers so every development environment has the same conventions.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: 'var(--accent-soft)' }}>MCP Integration</strong> — Atlassian MCP for Jira ticket
          management, Playwright MCP for browser-driven testing, Cloudflare MCP for DNS and tunnel operations,
          and Context7 for up-to-date library documentation.
        </p>
        <blockquote className={styles.callout}>
          This resume site — every skill page, the design-token system, the QR tracking backend, and the
          deployment pipeline — was built entirely through Claude Code sessions with Jira MCP integration.
        </blockquote>
        <CodeBlock filename="claude-code-workflow.py" language="python" code={claudeCodeExample} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Native Tool Calling & AI Agents</h2>
        <p className={styles.sectionText}>
          The Plex Dashboard runs an infrastructure-aware AI chatbot that uses Ollama's native tool-calling API.
          The model decides which tools to invoke — querying disk usage, checking service health, browsing media
          libraries — and the system executes them in a multi-round loop with time-budget management. Destructive
          actions (restart, purge) require user confirmation; read-only queries auto-execute.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: 'var(--accent-soft)' }}>Tool Registry</strong> — Declarative tool definitions with
          parameter types, live validation (resolving names to IDs via API lookups), execute functions, and
          confirmation gates. The registry pattern makes adding new tools a data declaration, not a code change.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: 'var(--accent-soft)' }}>Capability-Aware Routing</strong> — Sub-7B models are
          automatically capped at lighter prompt tiers because they are less reliable at structured tool-calling.
          The system matches model capability to prompt complexity rather than failing at inference time.
        </p>
        <CodeBlock filename="tool-calling.js" language="javascript" code={toolCallingExample} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Multi-Provider Architecture</h2>
        <p className={styles.sectionText}>
          Eight production applications share a single Ollama instance, each configuring its own model preferences
          via environment variables. GameStats runs deep analysis on 8B models, Recipes routes reasoning tasks to
          DeepSeek-R1, JobSearch uses fast 3B models for cover letters, and Plex pins to 7B for reliable tool-calling.
          Every AI call across the fleet is logged to DataTracker with model, latency, token count, and error state.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: 'var(--accent-soft)' }}>Fleet Telemetry</strong> — DataTracker aggregates AI metrics
          from all 8 consumers — tokens per second, error rates, model utilization, VRAM contention events. The
          Ollama telemetry collector runs as a separate daemon, sampling GPU state and correlating it with
          application-level request logs.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: 'var(--accent-soft)' }}>Zero Cloud Dependency</strong> — The entire AI stack runs
          on local hardware. No API keys, no usage fees, no data leaving the network. Model updates are a single
          <code style={{ color: 'var(--accent-soft)' }}> ollama pull</code> command, and rollbacks are instant.
        </p>
        <CodeBlock filename="multi-provider.py" language="python" code={multiProviderExample} />
      </div>
    </div>
  );
};

export default AIDevelopment;
