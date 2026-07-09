import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Skills.module.css';
import { codingSkills, softwareSkills } from '../data/skillsConfig';
import useDocTitle from '../hooks/useDocTitle';

const projects = [
  {
    title: 'Network Violation Tool Management',
    subtitle: 'End-to-end ownership — acquisition to production deployment, security hardening, and documentation.',
    bullets: [
      'Took over the tool from the previous team and stood it up in the HOC PCP environment with zero disruption.',
      'Configured Katana within PCP; established and maintained both Production and Development environments.',
      'Configured GitHub Workflows for automated builds and consistent deployments.',
      'Authored the Network Violation Homepage and Dev Notes, documenting the full management lifecycle.',
      'Conducted security review: secured the API, addressed missing rate limiting, and remediated JS exception messages.',
      'Set up the CCID Account required for tool integration and operation.',
    ],
  },
  {
    title: 'MWPv2 Platform Access & Management',
    subtitle: 'Operations-level management including DDoS defense, observability, and team enablement.',
    bullets: [
      'Managed the platform as primary point of contact for health and incident response.',
      'Set up Cloudflare rate limiting and created Rate Limiting graphs to prevent abuse.',
      'Created Kibana graphs for tracking DDoS events, improving real-time threat visibility.',
      'Wrote comprehensive Atlassian documentation for platform remediation best practices.',
    ],
  },
  {
    title: 'Toolkit Improvements',
    subtitle: 'Feature development, cross-team collaboration, and access management.',
    bullets: [
      'Added Plesk and cPanel Hypervisor search, broadening diagnostic capabilities.',
      'Collaborated with cPanel Dev Team to add VM status visibility — critical for server troubleshooting.',
      'Enabled Toolkit access for several teams, expanding cross-org adoption.',
      'Created separate Developer access group to scope permissions appropriately.',
    ],
  },
  {
    title: 'MySQL Operations & Remediation Scripts',
    subtitle: 'Standardization of database access workflows and operational scripting on cPanel.',
    bullets: [
      'Wrote .bash_profile configuration for seamless MySQL server access, standardizing the team\'s workflow.',
      'Configured and documented SOPs for consistent MySQL operations.',
      'Identified and updated non-functional cPanel scripts to restore remediation capabilities.',
    ],
  },
];

const aiCompetencies = [
  {
    title: 'AI-Assisted Development',
    bullets: [
      'Utilizing Claude Code for autonomous codebase work — multi-file refactoring, documentation generation, test creation, and architecture planning across full-stack projects.',
      'Applying prompt engineering techniques — system prompts, few-shot examples, token budget management, and temperature tuning — to produce reliable, repeatable AI outputs.',
      'Selecting models based on task complexity and cost profile, routing routine tasks to efficient models and complex reasoning to more capable ones.',
    ],
  },
  {
    title: 'AI API Integration',
    bullets: [
      'Integrating the Anthropic SDK (Claude) and OpenAI API into Python and Node.js applications — streaming responses, tool use / function calling, and multi-turn conversation management.',
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
      'Running open-source LLMs (Llama 3, Mistral, CodeLlama) locally using Ollama — full control of the model stack, no external data exposure, no per-token usage fees.',
      'Managing quantization trade-offs (Q4 vs Q8) and hardware resource allocation to run capable models on consumer-grade infrastructure.',
      'Deploying local AI endpoints for automated log summarization, internal documentation chatbots, and private code completion.',
    ],
  },
];

const sites = [
  { name: 'Dev.BrandonABoyd.com', url: 'http://dev.brandonaboyd.com/', desc: 'Development and staging environment for testing new features before production.' },
  { name: 'PhoenixAZEvents.com', url: 'http://phoenixazevents.com/', desc: 'Local event discovery site for the Phoenix, AZ area — WordPress with custom event listings.' },
  { name: 'RJPJ2020.com', url: 'http://rjpj2020.com/', desc: 'Wedding website celebrating the union of Richard & Polli Jones.' },
  { name: 'BrandonABoyd.com', url: 'http://brandonaboyd.com/', desc: 'A family website bringing together moments, memories, and milestones shared with my kids.' },
  { name: 'RachelIGarcia.com', url: 'http://racheligarcia.com/', desc: 'A heartfelt tribute dedicated to the life and legacy of Rachel Irene Garcia.' },
];

/** Favicon URL for a site, derived from its hostname. */
const faviconFor = (url) => {
  try {
    return `https://icons.duckduckgo.com/ip3/${new URL(url).hostname}.ico`;
  } catch {
    return null;
  }
};

/**
 * Skills — shows Coding and Software categories inline with expandable
 * skill bubbles. No separate navigation click required.
 */
const CategoryAccordion = ({ title, skills, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.categoryBlock}>
      <button
        className={styles.categoryHeader}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className={styles.categoryTitle}>{title}</span>
        <span className={`${styles.categoryChevron} ${open ? styles.categoryChevronOpen : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className={styles.skillsList}>
          {skills.map(({ id, label }) => (
            <Link key={id} to={`/${id}`} className={styles.skillBubble}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Skills = () => {
  useDocTitle('Skills');
  return (
    <div className={styles.skillsPage}>
      <p className={styles.intro}>
        Explore my technical skillset below. Click any skill to view a detailed breakdown,
        real-world use cases, and code examples from my work as a System Engineer III.
      </p>

      <div className={styles.categoriesRow}>
        <CategoryAccordion title="⌨ Coding &amp; Development" skills={codingSkills} defaultOpen={true} />
        <CategoryAccordion title="🛠 Software &amp; Tools" skills={softwareSkills} defaultOpen={true} />
      </div>

      <div className={styles.projectsSection}>
        <h2 className={styles.sitesHeading}>AI &amp; Automation</h2>
        <div className={styles.projectsGrid}>
          {aiCompetencies.map(item => (
            <div key={item.title} className={`${styles.projectCard} ${styles.aiCard}`}>
              <h3 className={styles.projectCardTitle}>{item.title}</h3>
              <ul className={styles.projectCardList}>
                {item.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sitesSection}>
        <h2 className={styles.sitesHeading}>Sites I've Built</h2>
        <div className={styles.sitesGrid}>
          {sites.map(site => (
            <div key={site.name} className={styles.siteCard}>
              <div className={styles.siteCardHead}>
                <img
                  className={styles.siteFavicon}
                  src={faviconFor(site.url)}
                  alt=""
                  width="22"
                  height="22"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                />
                <h3 className={styles.siteCardName}>{site.name}</h3>
              </div>
              <p className={styles.siteCardDesc}>{site.desc}</p>
              <a href={site.url} target="_blank" rel="noopener noreferrer" className={styles.siteCardLink}>
                Visit site <span aria-hidden="true">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.projectsSection}>
        <h2 className={styles.sitesHeading}>Key Projects &amp; Technical Accomplishments</h2>
        <div className={styles.projectsGrid}>
          {projects.map(project => (
            <div key={project.title} className={styles.projectCard}>
              <h3 className={styles.projectCardTitle}>{project.title}</h3>
              <p className={styles.projectCardSubtitle}>{project.subtitle}</p>
              <ul className={styles.projectCardList}>
                {project.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
