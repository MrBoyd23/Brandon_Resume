/**
 * src/data/skillsConfig.js
 *
 * Single source of truth for all skill definitions.
 * Adding a new skill only requires an entry here — routes, nav bubbles,
 * and detail pages are generated automatically.
 *
 * Skills without a custom component file automatically render the
 * SkillDetail placeholder component until real content is added.
 */

// Skills that have their own custom component in src/components/skills/
export const CUSTOM_SKILL_IDS = new Set([
  'api',              // Weather widget + TMDb browser (api.js → api2 + api3)
  'ansible',          // GitHub Ansible playbooks viewer
  'bash_scripting',   // GitHub Bash scripts viewer
  'css',              // CSS code viewer from GitHub
  'html',             // Contact form
  'javascript',       // GitHub component browser
  'apache',
  'php',
  'aws',
  'mysql',
  'python',
  'node',
  'react',
  'web_design',
  'phpmyadmin',
  'cpanel',
  'plesk',
  'seo',
  'jira',
  'github',
  'grafana',
  'prometheus',
  'servicenow',
  'liveperson',
  'wordpress',
  'e-commerce',
  'linux_admin',
  'website_analytics',
  'online_marketing',
  'data_analytics',
  'ai_development',
  'splunk',
  'nginx',
  'cloudflare',
  'iis',
  'confluence',
  'mssql',
  'kibana',
  'kentik',
  'github_workflows',
  'express',
]);

export const codingSkills = [
  { id: 'ai_development', label: 'AI Development' },
  { id: 'python',         label: 'Python'          },
  { id: 'react',          label: 'React'           },
  { id: 'javascript',     label: 'JavaScript'      },
  { id: 'node',           label: 'Node.js'         },
  { id: 'aws',            label: 'AWS'             },
  { id: 'api',            label: 'API'             },
  { id: 'ansible',        label: 'Ansible'         },
  { id: 'bash_scripting', label: 'Bash Scripting'  },
  { id: 'mysql',          label: 'MySQL'           },
  { id: 'css',            label: 'CSS'             },
  { id: 'html',           label: 'HTML'            },
  { id: 'web_design',     label: 'Web Design'      },
  { id: 'php',            label: 'PHP'             },
  { id: 'nginx',           label: 'Nginx'           },
  { id: 'express',         label: 'Express.js'      },
  { id: 'mssql',           label: 'MSSQL'           },
  { id: 'github_workflows',label: 'GitHub Workflows' },
  { id: 'apache',          label: 'Apache'          },
  { id: 'phpmyadmin',      label: 'phpMyAdmin'      },
];

export const softwareSkills = [
  { id: 'github',            label: 'GitHub'            },
  { id: 'linux_admin',       label: 'Linux Admin'       },
  { id: 'grafana',           label: 'Grafana'           },
  { id: 'prometheus',        label: 'Prometheus'        },
  { id: 'jira',              label: 'Jira'              },
  { id: 'servicenow',        label: 'ServiceNow'       },
  { id: 'data_analytics',    label: 'Data Analytics'    },
  { id: 'website_analytics', label: 'Website Analytics' },
  { id: 'seo',               label: 'SEO'              },
  { id: 'wordpress',         label: 'WordPress'        },
  { id: 'cpanel',            label: 'cPanel'            },
  { id: 'plesk',             label: 'Plesk'             },
  { id: 'splunk',             label: 'Splunk'            },
  { id: 'cloudflare',        label: 'Cloudflare'        },
  { id: 'iis',               label: 'IIS'               },
  { id: 'confluence',        label: 'Confluence'        },
  { id: 'kibana',            label: 'Kibana'            },
  { id: 'kentik',            label: 'Kentik'            },
  { id: 'e-commerce',        label: 'E-Commerce'        },
  { id: 'online_marketing',  label: 'Online Marketing'  },
  { id: 'liveperson',        label: 'LivePerson'        },
];

// Combined list with category tag — used in App.js to build routes
export const allSkills = [
  ...codingSkills.map(s  => ({ ...s, category: 'coding'   })),
  ...softwareSkills.map(s => ({ ...s, category: 'software' })),
];
