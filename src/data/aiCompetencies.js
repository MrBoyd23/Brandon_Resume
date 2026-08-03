const aiCompetencies = [
  {
    title: 'AI-Assisted Development',
    bullets: [
      'Built and maintained 18+ web applications using Claude Code, with Jira MCP integration for automated ticket lifecycle management across all projects.',
      'Applying prompt engineering techniques — system prompts, few-shot examples, token budget management, and temperature tuning — to produce reliable, repeatable AI outputs.',
      'Selecting models based on task complexity and cost profile, routing routine tasks to efficient models and complex reasoning to more capable ones.',
    ],
  },
  {
    title: 'AI API Integration',
    bullets: [
      'Multi-provider architecture: Ollama (local) + OpenAI + Claude API with automatic provider routing, fallback chains, and centralized telemetry across 8 production applications.',
      'Building middleware that routes requests to different AI models based on task type and complexity, balancing quality against token cost at scale.',
      'Handling real-time streaming in chat interfaces and CLI tools, including partial response processing and graceful error recovery.',
    ],
  },
  {
    title: 'MCP Tool Development',
    bullets: [
      'Building custom MCP (Model Context Protocol) tool servers that expose real-time system data, APIs, and operational actions to AI agents — extending LLMs from text generation into infrastructure-aware automation.',
      'Defining tool schemas with structured input validation that allow AI agents to query live system state, execute operations, and return structured results.',
    ],
  },
  {
    title: 'Self-Hosted AI Models',
    bullets: [
      'Centralized Ollama instance serving 8 production applications with consumer-specific model preferences, CPU-optimized 3b models, and telemetry tracking tokens/sec and latency across all consumers.',
      'Managing quantization trade-offs (Q4 vs Q8) and hardware resource allocation to run capable models on consumer-grade infrastructure.',
      'Deploying local AI endpoints for automated log summarization, internal documentation chatbots, and private code completion.',
    ],
  },
  {
    title: 'AI Safety & Reliability',
    bullets: [
      'Deterministic-first pipeline design where AI augments rather than replaces proven logic — grounding gates for hallucination prevention after a real incident where an LLM fabricated receipt data.',
      'Prompt injection detection and blocking, structured output validation with repair passes, and graceful degradation with rule-based fallbacks when AI is unavailable.',
    ],
  },
];

export default aiCompetencies;
