import React from 'react';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';
import CodeBlock from './CodeBlock';

const vramPrecheckCode = `# VRAM pre-check — 8 apps share one RTX 5060 Ti (16GB)
# Each consumer waits for available VRAM before requesting inference
GPU_TOTAL_VRAM = 16 * 1024**3
MODEL_VRAM_ESTIMATE = {
    "3b": 3.5 * 1024**3,
    "7b": 8.0 * 1024**3,
    "8b": 8.0 * 1024**3,
}

def check_vram_available(model_name, timeout=30, poll_interval=2):
    needed = _estimate_vram_needed(model_name)
    deadline = time.monotonic() + timeout

    while time.monotonic() < deadline:
        try:
            ps = requests.get(f"{OLLAMA_URL}/api/ps", timeout=3).json()

            if not ps.get("models"):
                return True  # GPU idle

            for m in ps["models"]:
                if m.get("name") == model_name:
                    return True  # our model already loaded

            used = sum(m.get("size_vram", 0) for m in ps["models"])
            if GPU_TOTAL_VRAM - used >= needed:
                return True  # enough room

        except Exception:
            return True  # fail open — let Ollama handle it

        time.sleep(poll_interval)

    return False  # timed out — proceed anyway`;

const modelRoutingCode = `# Task-specific model routing — match model capability to task complexity
# Each app configures its own model preferences via environment variables

TASK_MODELS = {
    "reasoning":  os.getenv("OLLAMA_MODEL_REASONING", "deepseek-r1:7b"),
    "general":    os.getenv("OLLAMA_MODEL", "qwen2.5:7b"),
    "fast":       os.getenv("OLLAMA_MODEL_FAST", "llama3.2:3b"),
}

# Recipes: structured recipe generation needs reasoning
result = generate(prompt, model=TASK_MODELS["reasoning"])

# Recipes: auto-tagging is just keyword extraction
tags = generate(prompt, model=TASK_MODELS["fast"])

# GameStats: betting analysis uses the general tier
analysis = generate(prompt, model=TASK_MODELS["general"])

# Plex SmartChat: tool-calling requires 7B+ models
# Sub-7B models are capped at lighter prompt tiers
def model_max_tier(model_tag):
    param_count = parse_param_count(model_tag)  # "7b" -> 7
    if param_count < 7:
        return "light"  # no tool definitions
    return "heavy"      # full tool-calling support`;

const fallbackChainCode = `# Multi-model fallback with validation and repair passes
def call_with_fallback(prompt, system_prompt="", result_validator=None):
    for model in FALLBACK_CHAIN:
        response = raw_call(prompt, system_prompt, model=model)

        if is_error(response):
            log.info(f"{model} returned error, trying next")
            continue

        if not result_validator or result_validator(response):
            return response, model

        # Validation failed — attempt repair at lower temperature
        repair_prompt = (
            "Your previous response did not follow the required format. "
            "Start directly with the first section header.\\n\\n" + prompt
        )
        repair = raw_call(repair_prompt, system_prompt,
                          model=model, temperature=0.1)

        if not is_error(repair) and result_validator(repair):
            return repair, model

    return response, None  # all models exhausted`;

const Ollama = () => {
  useDocTitle('Ollama');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Ollama</h1>
        <p className={styles.heroTagline}>Self-hosted AI infrastructure serving 8 production applications from a single GPU</p>
        <div className={styles.heroBadges}>
          {['Self-Hosted LLM', 'VRAM Management', 'Model Routing', 'Fallback Chains', 'Telemetry', 'Python', 'Node.js'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Centralized Model Serving</h2>
        <p className={styles.sectionText}>
          A single Ollama instance on a 16GB GPU serves 8 production applications — sports analysis, recipe
          generation, job matching, infrastructure chat, and more. Each app shares the same physical GPU, which
          means VRAM contention is a real problem. The solution: every consumer pre-checks GPU availability before
          requesting inference, waiting for another app's model to unload rather than forcing partial CPU
          offloading.
        </p>
        <CodeBlock filename="vram-precheck.py" language="python" code={vramPrecheckCode} />
        <div className={styles.statsRow}>
          <div className={styles.statBlock}>
            <div className={styles.statNum}>8</div>
            <div className={styles.statLabel}>Apps Served</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNum}>16GB</div>
            <div className={styles.statLabel}>Shared VRAM</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNum}>3</div>
            <div className={styles.statLabel}>Model Tiers</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNum}>&lt;45s</div>
            <div className={styles.statLabel}>Timeout</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Task-Specific Model Routing</h2>
        <p className={styles.sectionText}>
          Different tasks need different models. Recipe generation requires structured reasoning — worth the
          slower inference. Auto-tagging just needs keyword extraction — a 3B model handles it in under 2 seconds.
          The routing layer matches task complexity to model capability, with each application declaring its own
          preferences via environment config.
        </p>
        <CodeBlock filename="model-routing.py" language="python" code={modelRoutingCode} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Production Reliability</h2>
        <p className={styles.sectionText}>
          When a model fails or returns malformed output, the system doesn't just retry — it escalates through a
          fallback chain, attempting repair passes at lower temperatures before trying the next model. Every call
          is logged to a centralized telemetry system with latency, token counts, and error classification.
        </p>
        <blockquote className={styles.callout}>
          Every Ollama call across all 8 applications is logged to DataTracker with model, latency, token count,
          and error state — a complete audit trail for a fleet of AI consumers.
        </blockquote>
        <CodeBlock filename="fallback-chain.py" language="python" code={fallbackChainCode} />
      </div>
    </div>
  );
};

export default Ollama;
