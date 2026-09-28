const aiCompetencies = [
  {
    title: 'AI-Assisted Development',
    bullets: [
      'Built and maintained 18+ web applications using Claude Code with custom skill files, per-project CLAUDE.md conventions, and MCP integrations (Jira, Playwright, Cloudflare, Context7) for end-to-end ticket-to-merge workflows.',
      'Selecting models based on task complexity — routing deep analysis to 8B models, structured reasoning to DeepSeek-R1, and fast extraction tasks to 3B models — balancing quality against inference cost across 8 consumers.',
    ],
  },
  {
    title: 'Self-Hosted AI Fleet',
    bullets: [
      'Centralized Ollama instance on a 16GB GPU serving 8 production applications with VRAM pre-checks, per-app model preferences, priority semaphores, and fleet-wide telemetry tracking latency, tokens/sec, and error rates via DataTracker.',
      'Multi-model fallback chains with structured output validation and repair passes — if a response fails format requirements, the system re-prompts at lower temperature before escalating to the next model in the chain.',
    ],
  },
  {
    title: 'Prompt Engineering & Safety',
    bullets: [
      'Domain-specific system prompts with required output headers, confidence rating scales, and citation requirements — validated programmatically with repair passes and refusal-preamble stripping.',
      'Three-layer injection defense: input pattern scanning (14 regex patterns), hardened system prompts refusing role changes, and output sanitization stripping IPs, JWTs, and credentials before responses reach the frontend.',
    ],
  },
  {
    title: 'AI Tool Development',
    bullets: [
      'Native Ollama tool-calling loops with declarative tool registries, parameter validation via live API lookups, confirmation gates for destructive actions, and time-budget management across multi-round conversations.',
      'MCP tool servers exposing real-time system data, Jira workflows, and operational actions to AI agents — extending LLMs from text generation into infrastructure-aware automation.',
    ],
  },
  {
    title: 'Infrastructure & Observability',
    bullets: [
      '22 services across 3 servers deployed via interactive rsync pipelines with per-site exclusions, systemd units with security hardening (ProtectSystem, PrivateTmp, MemoryMax), and nginx reverse proxy.',
      'DataTracker: custom-built observability platform with 27 route modules — error ingestion, GitHub CI monitoring, Ollama telemetry, DNS leak detection, and security scanning — replacing Sentry/Datadog for the homelab.',
    ],
  },
];

export default aiCompetencies;
