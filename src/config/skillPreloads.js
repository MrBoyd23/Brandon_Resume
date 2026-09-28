const preloaders = {
  ai_development:    () => import('../components/skills/ai_development'),
  ollama:            () => import('../components/skills/ollama'),
  prompt_engineering:() => import('../components/skills/prompt_engineering'),
  sqlite:            () => import('../components/skills/sqlite'),
  homelab:           () => import('../components/skills/homelab'),
  python:            () => import('../components/skills/python'),
  react:          () => import('../components/skills/react'),
  javascript:     () => import('../components/skills/javascript'),
  aws:            () => import('../components/skills/aws'),
  github:         () => import('../components/skills/github'),
  linux_admin:    () => import('../components/skills/linux_admin'),
  grafana:        () => import('../components/skills/grafana'),
};

export default preloaders;
