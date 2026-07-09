/**
 * resume-builder.js
 *
 * Shared HTML template for the resume PDF.
 * Used by both generate-resume.js (static prebuild) and server/server.js (API endpoint).
 *
 * Call buildResumeHTML() to get the full styled HTML string, then render with Puppeteer.
 */

'use strict';

// ── Helpers ──────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bullets(items) {
  return `<ul class="bl">${items.map(b => `<li>${esc(b)}</li>`).join('')}</ul>`;
}

function comp(title, items) {
  return `<p class="comp">${esc(title)}</p>${bullets(items)}`;
}

function sectionHeader(title) {
  return `<div class="sh">${esc(title)}</div>`;
}

function jobHeader(title, company, dates, location) {
  return `
    <div class="jt">${esc(title)}</div>
    <div class="jm">
      <span class="co">${esc(company)}</span>
      <span class="dot">•</span>${esc(dates)}<span class="dot">•</span><em>${esc(location)}</em>
    </div>`;
}

// ── HTML Builder ─────────────────────────────────────────────────────────────

function buildResumeHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  body {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    color: #1a1a1a;
    background: #ffffff;
    font-size: 9.5pt;
    line-height: 1.5;
  }

  /* ── Header ─────────────────────────────────────────────────── */
  .hdr {
    background: linear-gradient(135deg, #0a0f1a 0%, #0f172a 30%, #1e3a5f 60%, #0f172a 85%, #0a0f1a 100%);
    padding: 30px 52px 24px;
    text-align: center;
    position: relative;
  }

  .name {
    font-size: 25pt;
    font-weight: 800;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: #f1f5f9;
    margin-bottom: 6px;
    font-family: 'Inter', Arial, sans-serif;
  }

  .title-bar {
    font-size: 7.5pt;
    letter-spacing: 5.5px;
    text-transform: uppercase;
    color: #94a3b8;
    font-family: 'Poppins', Arial, sans-serif;
    font-weight: 400;
    margin-bottom: 16px;
  }

  .hdr-rule {
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #3b82f6 40%, #60a5fa 50%, #3b82f6 60%, transparent 100%);
  }

  /* ── Body ────────────────────────────────────────────────────── */
  .body { padding: 24px 48px 36px; }

  /* ── Section headers ─────────────────────────────────────────── */
  .sh {
    font-size: 7.5pt;
    font-weight: 700;
    color: #2563eb;
    letter-spacing: 3px;
    text-transform: uppercase;
    border-bottom: 1.5px solid #2563eb;
    padding-bottom: 4px;
    margin: 22px 0 10px;
  }

  /* ── Job blocks ──────────────────────────────────────────────── */
  .jb { page-break-inside: avoid; }

  .jt {
    font-size: 10.5pt;
    font-weight: 700;
    color: #0f172a;
    margin-top: 14px;
    margin-bottom: 1px;
    letter-spacing: 0.3px;
  }

  .jm {
    font-size: 8.5pt;
    color: #555555;
    margin-bottom: 6px;
    font-family: 'Poppins', Arial, sans-serif;
  }

  .co { font-weight: 600; color: #1a1a1a; }

  .dot { color: #3b82f6; margin: 0 5px; font-size: 7pt; vertical-align: middle; }

  /* ── Page margins — top margin on page 2+ so content isn't flush ── */
  @page { margin: 0.45in 0 0.3in 0; }
  @page :first { margin: 0; }

  /* ── Competency headers ──────────────────────────────────────── */
  .comp {
    font-size: 8.5pt;
    font-weight: 600;
    font-style: italic;
    color: #1e3a5f;
    margin: 9px 0 3px;
    font-family: 'Poppins', Arial, sans-serif;
    /* Keep header with its bullets — never orphan a competency title */
    page-break-after: avoid;
    break-after: avoid;
  }

  /* ── Bullet lists ────────────────────────────────────────────── */
  .bl {
    list-style: none;
    margin-bottom: 2px;
    /* Stay with the competency header above */
    page-break-before: avoid;
    break-before: avoid;
  }

  .bl li {
    font-size: 9pt;
    color: #2d2d2d;
    padding-left: 16px;
    position: relative;
    margin-bottom: 2.5px;
    line-height: 1.45;
  }

  .bl li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: #3b82f6;
    font-size: 7.5pt;
    top: 1.5px;
  }
</style>
</head>
<body>

<!-- ── HEADER ─────────────────────────────────────────────────── -->
<div class="hdr">
  <div class="name">Brandon Anthony Boyd</div>
  <div class="title-bar">Engineer &nbsp;&nbsp;•&nbsp;&nbsp; Administrator &nbsp;&nbsp;•&nbsp;&nbsp; Developer</div>
  <div class="hdr-rule"></div>
</div>

<!-- ── BODY ───────────────────────────────────────────────────── -->
<div class="body">

  ${sectionHeader('Professional Experience')}

  <!-- System Engineer III -->
  <div class="jb">
    ${jobHeader('System Engineer III', 'GoDaddy', 'February 2025 – Present', 'Remote')}
    ${comp('Independent Problem Solving & Execution', [
      'Consistently solving complex problems and delivering solutions independently, often serving as a go-to resource for peers facing similar challenges.',
      'Operating with a high degree of autonomy, requiring minimal direction on day-to-day work and proactively scoping new assignments.',
    ])}
    ${comp('Documentation Excellence', [
      'Maintaining a strong track record of high-quality ticket documentation, upholding high team standards.',
      'Authoring comprehensive documentation across multiple products and platforms, including operational SOPs, developer notes, and Atlassian knowledge base articles.',
    ])}
    ${comp('Emerging Leadership', [
      'Regularly leading standups, team meetings, and cross-functional discussions.',
      'Recognized as an emerging leader driving alignment, accountability, and team-wide operational readiness.',
    ])}
    ${comp('Continuous Improvement & Innovation', [
      'Championing continuous improvement initiatives, identifying and implementing process enhancements, tooling upgrades, and automation that increased team efficiency.',
      'Taking calculated risks and experimenting with new approaches, with a proven history of turning experiments into adopted solutions.',
    ])}
    ${comp('Multi-Technology Investigations', [
      'Investigating and resolving issues of moderate-to-high scope across multiple technologies—including application infrastructure, networking, databases, and security.',
      'Often connecting dots across systems that others miss.',
    ])}
    ${comp('Customer-First Mindset', [
      'Proactively identifying gaps and problems within area of ownership and driving them to resolution without waiting for escalation.',
      'Leading complex, customer-impacting investigations end-to-end, coordinating across teams and delivering root cause analysis with actionable follow-ups.',
    ])}
    ${comp('Operational Readiness & Training', [
      'Independently driving operational readiness across the team, including maintaining up-to-date documentation, developing training materials, onboarding new team members, and writing SOPs to standardize processes.',
    ])}
    ${comp('Subject Matter Expertise', [
      'Established SME in Incident Management Process and one or more System Operations products/services, regularly consulted by peers and leadership for guidance.',
      'Deep experience coordinating and improving incident response workflows over multiple cycles.',
    ])}
  </div>

  <!-- System Engineer II -->
  <div class="jb">
    ${jobHeader('System Engineer II', 'GoDaddy', 'July 2021 – February 2025', 'Remote')}
    ${bullets([
      'Developed Remediation Scripting For Troubleshooting Server Environment',
      'Utilized CMDB (Configuration Management Database) with ServiceNow',
      'Incident Management & Alert Monitoring On 100K+ Server Network',
      'Subject Matter Expert On WordPress Server Configuration & Remediation',
      'Monitored Network For DDoS Attacks Against Different Environments',
      'Engaged with Kentik Software To Track Trends In Network Traffic',
      'Mitigated Attacks Against Servers (Network Level Blocking, Network Swings, NetScout, iptables)',
      'Identify Trending Incidents, Perform Root Cause Analysis & Implement Process Changes To Reduce/Eliminate Recurrence',
      'Apache & IIS Troubleshooting',
      'Setup/Configure Services In WHM/cPanel & Plesk/Remote Desktop',
      'MySQL/MSSQL Database Troubleshooting',
      'Conducted Website & Content Migrations',
      'DNS & Email Configuration Setup',
      'Assisted Legal Team In Making Data Archives',
      'Utilized Confluence & Jira For Document Tracking & Versioning',
      'Completed Training To Keep Up With Best Security Principles & Practices',
    ])}
  </div>

  <!-- System Engineer I -->
  <div class="jb">
    ${jobHeader('System Engineer I', 'GoDaddy', 'November 2018 – July 2021', 'Remote')}
    ${bullets([
      'Incident Management & Alert Monitoring On 100K+ Server Network',
      'Identify Trending Incidents, Perform Root Cause Analysis & Implement Process Changes To Reduce & Eliminate Recurrence',
      'Utilize Splunk Software & Command-Line To Review Relayed Email',
      'Coordinated With Tier 2 Agents To Assist In Providing First Contact Resolution',
      'Apache & IIS Troubleshooting',
      'Managed & Issued Network Violations For Users Abusing Network & Hardware Services',
      'Website & Server Restorations',
      'MySQL/MSSQL Database Troubleshooting',
      'Assist Office of the CEO & Management with Escalated Matters In The Environment',
      'Website Security Review/Configuration/Analysis',
      'Properly Identify and Remove Malware From Compromised Websites',
      'Coordinated with Tier 2 Level Teams On How To Correct Issues with New Tools',
      'Used Documented Issues To Have Developers Create Tools To Fix Common Issues',
      'Created Technical Documentation for Tier 1 & 2 For Best Practices When Configuring Services',
      'Setup of A HelpBot (LiveEngage), Automated Bot That Provides Answers To Agents Based On Common Issues In The Environment',
    ])}
  </div>

  <!-- Hosting Technical Lead -->
  <div class="jb">
    ${jobHeader('Hosting Technical Lead', 'GoDaddy', 'February 2016 – November 2018', 'Scottsdale, Arizona | Remote')}
    ${bullets([
      'Worked Server/Managed Services Incident Queue',
      'Website Security Reviews/Configuration/Analysis',
      'Utilized Splunk To Review Email Server Relays, As Well As Incoming And Outgoing Emails On The Network',
      'Updated On External Facing Articles',
      'Beta Tested Cloud Servers',
      'Reviewed Active Issues With Internal Agents',
      'Created Internal Documentation In Relation To Troubleshooting Existing Support Issues',
      'Tracked Trending Issues Affecting The Network Over Extended Periods',
      'Completed Network Violation Reviews',
      'Migrated WordPress Website Content (WordPress/Joomla/Personal Sites)',
      'Completed Shared Hosting/Server Restores',
    ])}
  </div>

  <!-- Subject Matter Expert -->
  <div class="jb">
    ${jobHeader('Subject Matter Expert | Website Security', 'GoDaddy | Sucuri', 'August 2015 – November 2018', 'Scottsdale, Arizona')}
    ${bullets([
      'Determined Cost-saving Strategies By Publicizing Internal & New Documentation',
      'Subject Matter Expert (Website Security | Sucuri)',
      'Utilized Confluence/Jira For Document Tracking And Versioning',
      'Implemented Proper Security Principles And Practices',
      'Website Security Review/Configuration/Analysis',
      'Properly Identify And Remove Malware From Compromised Websites',
      'Implemented Fixes On Mis-configured Security Plans via API',
      'Used Documented Issues To Have Developers Create Tools To Fix Common Issues',
      'Coordinated With Tier 2 Level Teams On How To Correct Issues With New Tools',
      'Created Technical Documentation For Tier 1 & 2 For Best Practices When Configuring Services',
    ])}
  </div>

  <!-- Advanced Hosting IV -->
  <div class="jb">
    ${jobHeader('Advanced Hosting IV', 'GoDaddy', 'November 2013 – January 2016', 'Scottsdale, Arizona')}
    ${bullets([
      'Tested cPanel And Plesk Releases For Shared Hosting Environment',
      'Created Supporting Documentation/Help Articles For Customers/Agents',
      'Provided Hosting Support For Front Of Site Chat Representatives',
      'Reviewed And Corresponded To Network Violations In Relation To Customer Hosting Plans',
      'Incident Management via Internal Ticketing System',
    ])}
  </div>

  <!-- Hosting Online Support Team -->
  <div class="jb">
    ${jobHeader('Hosting Online Support Team', 'GoDaddy', 'February 2008 – October 2013', 'Scottsdale, Arizona')}
    ${bullets([
      'Instrumental In The Creation Of A Team Dedicated To Hosting Support',
      'Piloted The Server Support Chat Team',
      'Identified & Helped Resolve Issues In Relation To Customer Shared & Server Platforms',
      'Reviewed Incidents From Customers via Email',
      'Troubleshoot Email Configuration (MX Records/Mail Client Configuration)',
      'Identified Trending Issues Within The Network',
    ])}
  </div>

  <!-- ── AI & AUTOMATION ──────────────────────────────────────── -->
  ${sectionHeader('AI & Automation')}

  ${comp('AI-Assisted Development', [
    'Utilizing Claude Code for autonomous codebase work — multi-file refactoring, documentation generation, test creation, and architecture planning across full-stack projects.',
    'Applying prompt engineering techniques — system prompts, few-shot examples, token budget management, and temperature tuning — to produce reliable, repeatable AI outputs.',
    'Selecting models based on task complexity and cost profile, routing routine tasks to efficient models and complex reasoning to more capable ones.',
  ])}

  ${comp('AI API Integration', [
    'Integrating the Anthropic SDK (Claude) and OpenAI API into Python and Node.js applications — streaming responses, tool use / function calling, and multi-turn conversation management.',
    'Building middleware that routes requests to different AI models based on task type and complexity, balancing quality against token cost at scale.',
    'Handling real-time streaming in chat interfaces and CLI tools, including partial response processing and graceful error recovery.',
  ])}

  ${comp('MCP Tool Development', [
    'Building custom MCP (Model Context Protocol) tool servers that expose real-time system data, APIs, and operational actions to AI agents — extending LLMs from text generation into infrastructure-aware automation.',
    'Defining tool schemas with structured input validation that allow AI agents to query live system state, execute operations, and return structured results.',
  ])}

  ${comp('Self-Hosted AI Models', [
    'Running open-source LLMs (Llama 3, Mistral, CodeLlama) locally using Ollama — full control of the model stack, no external data exposure, no per-token usage fees.',
    'Managing quantization trade-offs (Q4 vs Q8) and hardware resource allocation to run capable models on consumer-grade infrastructure.',
    'Deploying local AI endpoints for automated log summarization, internal documentation chatbots, and private code completion.',
  ])}

  <!-- ── KEY PROJECTS ──────────────────────────────────────────── -->
  ${sectionHeader('Key Projects & Technical Accomplishments')}

  ${comp('Network Violation Tool Management', [
    'Took over the tool from the previous team and stood it up in the HOC PCP environment with zero disruption.',
    'Configured Katana within PCP; established and maintained both Production and Development environments.',
    'Configured GitHub Workflows for automated builds and consistent deployments.',
    'Authored the Network Violation Homepage and Dev Notes, documenting the full management lifecycle.',
    'Conducted security review: secured the API, addressed missing rate limiting, and remediated JS exception messages.',
    'Set up the CCID Account required for tool integration and operation.',
  ])}

  ${comp('MWPv2 Platform Access & Management', [
    'Managed the platform as primary point of contact for health and incident response.',
    'Set up Cloudflare rate limiting and created Rate Limiting graphs to prevent abuse.',
    'Created Kibana graphs for tracking DDoS events, improving real-time threat visibility.',
    'Wrote comprehensive Atlassian documentation for platform remediation best practices.',
  ])}

  ${comp('Toolkit Improvements', [
    'Added Plesk and cPanel Hypervisor search, broadening diagnostic capabilities.',
    'Collaborated with cPanel Dev Team to add VM status visibility — critical for server troubleshooting.',
    'Enabled Toolkit access for several teams, expanding cross-org adoption.',
    'Created separate Developer access group to scope permissions appropriately.',
  ])}

  ${comp('MySQL Operations & Remediation Scripts', [
    "Wrote .bash_profile configuration for seamless MySQL server access, standardizing the team's workflow.",
    'Configured and documented SOPs for consistent MySQL operations.',
    'Identified and updated non-functional cPanel scripts to restore remediation capabilities.',
  ])}

</div>
</body>
</html>`;
}

module.exports = { buildResumeHTML };
