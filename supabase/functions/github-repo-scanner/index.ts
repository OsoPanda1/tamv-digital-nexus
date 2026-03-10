import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================================
// TAMV GitHub Repo Scanner — Analiza repos de OsoPanda1
// Clasifica por dominio, detecta mejoras integrables al ecosistema TAMV
// ============================================================================

const TARGET_USERNAME = 'OsoPanda1';

interface RepoData {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  size: number;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  default_branch: string;
  open_issues_count: number;
  has_wiki: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: string;
}

interface ClassifiedRepo {
  name: string;
  url: string;
  description: string;
  language: string;
  size: number;
  stars: number;
  forks: number;
  fork: boolean;
  updatedAt: string;
  createdAt: string;
  pushedAt: string;
  topics: string[];
  defaultBranch: string;
  archived: boolean;
  domain: string;
  domainConfidence: number;
  status: string;
  waveTarget: number;
  tamvSignals: string[];
  evolutionPotential: string[];
  integrableModules: string[];
}

// Domain classification heuristics
const DOMAIN_SIGNALS: Record<string, { keywords: string[]; filePatterns: string[] }> = {
  CORE: {
    keywords: ['tamv', 'nexus', 'digital', 'platform', 'core', 'shell', 'portal', 'main', 'app', 'web'],
    filePatterns: ['App.tsx', 'main.tsx', 'index.html'],
  },
  IA: {
    keywords: ['isabella', 'ai', 'chat', 'nlp', 'ml', 'intelligence', 'bot', 'agent', 'sof', 'quantum'],
    filePatterns: ['isabella', 'ai-', 'chat'],
  },
  SEGURIDAD: {
    keywords: ['security', 'sentinel', 'anubis', 'dekateotl', 'guard', 'auth', 'shield', 'crypto'],
    filePatterns: ['security', 'sentinel', 'guard'],
  },
  XR: {
    keywords: ['xr', '3d', 'metaverse', 'threejs', 'webxr', 'vr', 'ar', 'blender', 'render', 'dream'],
    filePatterns: ['three', 'xr', '3d', 'render'],
  },
  ECONOMIA: {
    keywords: ['economy', 'wallet', 'tcep', 'teep', 'marketplace', 'payment', 'stripe', 'msr', 'finance', 'monetiz'],
    filePatterns: ['wallet', 'payment', 'economy'],
  },
  DOCS: {
    keywords: ['docs', 'wiki', 'book', 'university', 'utamv', 'course', 'learn', 'education', 'tutorial'],
    filePatterns: ['docs', 'wiki', 'readme'],
  },
  INFRA: {
    keywords: ['infra', 'deploy', 'docker', 'k8s', 'ci', 'cd', 'devops', 'terraform', 'helm', 'config'],
    filePatterns: ['Dockerfile', 'docker-compose', 'k8s', '.yml'],
  },
};

function classifyRepo(repo: RepoData): { domain: string; confidence: number; signals: string[] } {
  const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
  const scores: Record<string, { score: number; signals: string[] }> = {};

  for (const [domain, config] of Object.entries(DOMAIN_SIGNALS)) {
    const signals: string[] = [];
    let score = 0;

    for (const kw of config.keywords) {
      if (text.includes(kw)) {
        score += 2;
        signals.push(`keyword:${kw}`);
      }
    }

    // Boost for topic matches
    for (const topic of (repo.topics || [])) {
      for (const kw of config.keywords) {
        if (topic.includes(kw)) {
          score += 3;
          signals.push(`topic:${topic}`);
        }
      }
    }

    // Language-based hints
    if (domain === 'IA' && ['Python', 'Jupyter Notebook'].includes(repo.language || '')) {
      score += 1;
      signals.push('lang:python/jupyter');
    }
    if (domain === 'CORE' && ['TypeScript', 'JavaScript'].includes(repo.language || '')) {
      score += 1;
    }
    if (domain === 'XR' && repo.language === 'GLSL') {
      score += 2;
      signals.push('lang:glsl');
    }

    scores[domain] = { score, signals };
  }

  // Find best match
  let bestDomain = 'NON_TAMV';
  let bestScore = 0;
  let bestSignals: string[] = [];

  for (const [domain, { score, signals }] of Object.entries(scores)) {
    if (score > bestScore) {
      bestDomain = domain;
      bestScore = score;
      bestSignals = signals;
    }
  }

  // Check if it has any TAMV signal at all
  const isTAMV = text.includes('tamv') || text.includes('isabella') || text.includes('nexus') || text.includes('sentinel');
  if (bestScore < 2 && !isTAMV) {
    bestDomain = 'NON_TAMV';
  }

  const confidence = Math.min(bestScore / 10, 1);

  return { domain: bestDomain, confidence, signals: bestSignals };
}

function detectEvolutionPotential(repo: RepoData): string[] {
  const potential: string[] = [];
  const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();

  // Detect specific capabilities
  if (text.includes('rust') || repo.language === 'Rust') potential.push('PERF: Rust modules for high-performance backend');
  if (text.includes('python') || repo.language === 'Python') potential.push('AI/ML: Python pipelines for Isabella evolution');
  if (text.includes('blockchain') || text.includes('web3') || text.includes('solidity')) potential.push('CRYPTO: Blockchain/Web3 integration for TCEP');
  if (text.includes('react') || text.includes('next')) potential.push('UI: React/Next components for TAMV Online');
  if (text.includes('three') || text.includes('webgl') || text.includes('3d')) potential.push('XR: 3D/WebGL assets for DreamSpaces');
  if (text.includes('api') || text.includes('graphql')) potential.push('API: Service endpoints for unified API');
  if (text.includes('test') || text.includes('spec')) potential.push('QA: Test suites for CI/CD pipeline');
  if (text.includes('deploy') || text.includes('docker')) potential.push('INFRA: Deployment configs for K8s/Docker');
  if (text.includes('auth') || text.includes('oauth')) potential.push('AUTH: Auth modules for identity system');
  if (text.includes('social') || text.includes('feed') || text.includes('chat')) potential.push('SOCIAL: Social features for TAMV network');
  if (text.includes('game') || text.includes('unity') || text.includes('unreal')) potential.push('GAMING: Game engine assets for metaverse');
  if (text.includes('mobile') || text.includes('flutter') || text.includes('react-native')) potential.push('MOBILE: Mobile app components');

  if (potential.length === 0) {
    if (repo.size > 1000) potential.push('ASSETS: Large repo with potential reusable assets');
    if (!repo.fork) potential.push('ORIGINAL: Original project with unique logic');
  }

  return potential;
}

function detectIntegrableModules(repo: RepoData): string[] {
  const modules: string[] = [];
  const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();

  if (text.includes('component') || text.includes('ui') || text.includes('widget')) modules.push('UI Components');
  if (text.includes('hook') || text.includes('util')) modules.push('Hooks/Utilities');
  if (text.includes('service') || text.includes('api')) modules.push('API Services');
  if (text.includes('schema') || text.includes('model') || text.includes('type')) modules.push('Data Models');
  if (text.includes('config') || text.includes('env')) modules.push('Configuration');
  if (text.includes('style') || text.includes('css') || text.includes('theme')) modules.push('Design System');
  if (text.includes('doc') || text.includes('readme') || text.includes('wiki')) modules.push('Documentation');

  return modules;
}

function determineStatus(repo: RepoData, domain: string, confidence: number): string {
  if (repo.name === 'tamv-digital-nexus') return 'INTEGRATED';
  if (confidence >= 0.6) return 'CONFIRMED';
  if (confidence >= 0.2) return 'POSSIBLE';
  if (domain === 'NON_TAMV') return 'NON_TAMV';
  return 'POSSIBLE';
}

function determineWave(domain: string, status: string): number {
  if (status === 'INTEGRATED') return 1;
  if (domain === 'DOCS' || domain === 'CORE') return 1;
  if (domain === 'IA' || domain === 'SEGURIDAD') return 2;
  if (domain === 'ECONOMIA' || domain === 'XR') return 3;
  return 4;
}

async function fetchAllRepos(): Promise<RepoData[]> {
  const allRepos: RepoData[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `https://api.github.com/users/${TARGET_USERNAME}/repos?page=${page}&per_page=${perPage}&type=all&sort=updated`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TAMV-Repo-Scanner/2.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error ${response.status}: ${errorText}`);
    }

    const repos: RepoData[] = await response.json();
    if (repos.length === 0) break;

    allRepos.push(...repos);
    page++;

    // Safety: GitHub API rate limit check
    const remaining = response.headers.get('X-RateLimit-Remaining');
    if (remaining && parseInt(remaining) < 5) {
      console.warn('GitHub API rate limit approaching, stopping pagination');
      break;
    }
  }

  return allRepos;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[TAMV Scanner] Starting scan of ${TARGET_USERNAME}...`);
    
    const rawRepos = await fetchAllRepos();
    console.log(`[TAMV Scanner] Fetched ${rawRepos.length} repos`);

    const classified: ClassifiedRepo[] = rawRepos
      .filter(r => !r.archived && !r.disabled)
      .map(repo => {
        const { domain, confidence, signals } = classifyRepo(repo);
        const status = determineStatus(repo, domain, confidence);
        const wave = determineWave(domain, status);
        const evolution = detectEvolutionPotential(repo);
        const integrable = detectIntegrableModules(repo);

        return {
          name: repo.name,
          url: repo.html_url,
          description: repo.description || 'Sin descripción',
          language: repo.language || 'Unknown',
          size: repo.size,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          fork: repo.fork,
          updatedAt: repo.updated_at,
          createdAt: repo.created_at,
          pushedAt: repo.pushed_at,
          topics: repo.topics || [],
          defaultBranch: repo.default_branch,
          archived: repo.archived,
          domain,
          domainConfidence: confidence,
          status,
          waveTarget: wave,
          tamvSignals: signals,
          evolutionPotential: evolution,
          integrableModules: integrable,
        };
      });

    // Sort: INTEGRATED first, then CONFIRMED, then by confidence
    classified.sort((a, b) => {
      const statusOrder: Record<string, number> = { INTEGRATED: 0, CONFIRMED: 1, POSSIBLE: 2, NON_TAMV: 3 };
      const diff = (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
      if (diff !== 0) return diff;
      return b.domainConfidence - a.domainConfidence;
    });

    // Summary stats
    const summary = {
      totalRepos: rawRepos.length,
      activeRepos: classified.length,
      archivedSkipped: rawRepos.length - classified.length,
      byDomain: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byWave: {} as Record<string, number>,
      byLanguage: {} as Record<string, number>,
      totalSizeKB: classified.reduce((sum, r) => sum + r.size, 0),
      withEvolutionPotential: classified.filter(r => r.evolutionPotential.length > 0).length,
      rateLimit: {
        remaining: null as string | null,
        reset: null as string | null,
      },
    };

    for (const repo of classified) {
      summary.byDomain[repo.domain] = (summary.byDomain[repo.domain] || 0) + 1;
      summary.byStatus[repo.status] = (summary.byStatus[repo.status] || 0) + 1;
      summary.byWave[`wave_${repo.waveTarget}`] = (summary.byWave[`wave_${repo.waveTarget}`] || 0) + 1;
      summary.byLanguage[repo.language] = (summary.byLanguage[repo.language] || 0) + 1;
    }

    console.log(`[TAMV Scanner] Classification complete: ${JSON.stringify(summary.byDomain)}`);

    return new Response(JSON.stringify({
      ok: true,
      scannedAt: new Date().toISOString(),
      targetUser: TARGET_USERNAME,
      summary,
      repos: classified,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('[TAMV Scanner] Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({
      ok: false,
      error: msg,
      scannedAt: new Date().toISOString(),
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
