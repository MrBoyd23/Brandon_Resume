# AI & Automation — Resume Section Plan COMPLETED 2026-06-01

*Updated: May 2026*

---

## Objective

Add a dedicated **AI & Automation** section to both the website homepage (`Experience.js`)
and the downloadable Word document (`generate-resume.js` / `server/server.js`) covering
four core capability areas drawn directly from the `ai_development.js` skill page.

**Scope:** Claude Code work and AI inner-workings only.
No specific project callouts. No GoDaddy references.

---

## Four Areas & Proposed Content

---

### 1. AI-Assisted Development

**Competency header:** `AI-Assisted Development`

**Bullets:**
- Utilizing Claude Code as a primary development tool for autonomous codebase work —
  including multi-file refactoring, documentation generation, test creation, and
  architecture planning across full-stack projects.
- Applying prompt engineering techniques — system prompts, few-shot examples, token
  budget management, and temperature tuning — to produce reliable, repeatable AI
  outputs across development workflows.
- Selecting models based on task complexity and cost profile, routing routine tasks to
  efficient models and complex reasoning to more capable ones to balance quality and cost.

---

### 2. AI API Integration

**Competency header:** `AI API Integration`

**Bullets:**
- Integrating the Anthropic SDK (Claude) and OpenAI API into Python and Node.js
  applications — implementing streaming responses, tool use / function calling, and
  multi-turn conversation management.
- Building middleware that routes requests to different AI models based on task type
  and complexity, balancing response quality against token cost at scale.
- Handling real-time streaming responses in chat interfaces and CLI tools, including
  partial response processing and graceful error recovery.

---

### 3. MCP Tool Development

**Competency header:** `MCP Tool Development`

**Bullets:**
- Building custom MCP (Model Context Protocol) tool servers that expose real-time
  system data, APIs, and operational actions to AI agents — extending LLMs from
  text generation into actionable, infrastructure-aware automation.
- Defining tool schemas with structured input validation that allow AI agents to
  query live system state, execute operations, and return structured results within
  an agent workflow.

---

### 4. Self-Hosted AI Models

**Competency header:** `Self-Hosted AI Models`

**Bullets:**
- Running open-source LLMs (Llama 3, Mistral, CodeLlama) locally using Ollama —
  maintaining full control of the model stack with no external data exposure and
  no per-token usage fees.
- Managing quantization trade-offs (Q4 vs Q8) and hardware resource allocation
  to run capable models on consumer-grade infrastructure.
- Deploying local AI endpoints for automated log summarization, internal
  documentation chatbots, and private code completion workflows.

---

## Placement

### Website — `Experience.js`
Add as a new `<div className="job">` timeline card **after the last GoDaddy entry**
so it appears as a peer-level entry in the timeline, not buried inside a job.

Use the same competency header + bullet pattern as the System Engineer III section.

**Card header:**
```
AI & Automation
Personal Development  •  Ongoing  •  Remote
```

---

### Word Document — `generate-resume.js` + `server/server.js`
Add a new `sectionHeader('AI & AUTOMATION')` block after `PROFESSIONAL EXPERIENCE`.

Uses existing helper functions — no new formatting infrastructure needed:
- `sectionHeader()` for the section title
- `competencyHeader()` for each of the four areas
- `bullets()` for the bullet points under each

---

## Files to Modify When Implementing

| File | Change |
|---|---|
| `src/components/Experience.js` | New timeline card after last job entry |
| `generate-resume.js` | New section after PROFESSIONAL EXPERIENCE |
| `server/server.js` | Mirror the same addition in API endpoint |

---

## What This Section Does NOT Include

- No specific project names or client references
- No GoDaddy attribution
- No HelpBot / LivePerson references
- No certifications, training courses, or credentials
- No fine-tuning, RAG, embeddings, or vector database claims
