import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TARGET_USER = 'OsoPanda1';
const TOP_REPOS = 100;

interface SyncResult {
  source: string;
  status: 'success' | 'error';
  data?: any;
  error?: string;
  timestamp: string;
}

async function githubFetch(url: string, token?: string) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'TAMV-Content-Sync/2.0',
      ...(token ? { Authorization: `token ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${res.status}: ${text}`);
  }

  return res.json();
}

async function fetchProfile(token?: string): Promise<SyncResult> {
  try {
    const url = token ? 'https://api.github.com/user' : `https://api.github.com/users/${TARGET_USER}`;
    const data = await githubFetch(url, token);
    return { source: 'github-profile', status: 'success', data, timestamp: new Date().toISOString() };
  } catch (error) {
    return { source: 'github-profile', status: 'error', error: (error as Error).message, timestamp: new Date().toISOString() };
  }
}

async function fetchTopRepos(token?: string): Promise<SyncResult> {
  try {
    const repos: any[] = [];
    let page = 1;

    while (repos.length < TOP_REPOS) {
      const url = token
        ? `https://api.github.com/user/repos?sort=updated&per_page=100&page=${page}&visibility=all&affiliation=owner,collaborator,organization_member`
        : `https://api.github.com/users/${TARGET_USER}/repos?sort=updated&per_page=100&page=${page}&type=owner`;

      const batch = await githubFetch(url, token);
      if (!Array.isArray(batch) || batch.length === 0) break;
      repos.push(...batch);
      page += 1;
    }

    const normalized = repos
      .filter((r) => !r.archived && !r.disabled)
      .slice(0, TOP_REPOS)
      .map((r) => ({
        name: r.name,
        full_name: r.full_name,
        private: !!r.private,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        updated_at: r.updated_at,
        pushed_at: r.pushed_at,
        size: r.size,
        topics: r.topics || [],
        html_url: r.html_url,
      }));

    return { source: 'github-top-repos', status: 'success', data: normalized, timestamp: new Date().toISOString() };
  } catch (error) {
    return { source: 'github-top-repos', status: 'error', error: (error as Error).message, timestamp: new Date().toISOString() };
  }
}

function classifyDomain(repo: any): string {
  const text = `${repo.name} ${(repo.topics || []).join(' ')} ${repo.language || ''}`.toLowerCase();
  if (text.includes('ai') || text.includes('isabella')) return 'IA';
  if (text.includes('security') || text.includes('anubis') || text.includes('sentinel')) return 'SEGURIDAD';
  if (text.includes('economy') || text.includes('wallet') || text.includes('payment')) return 'ECONOMIA';
  if (text.includes('xr') || text.includes('3d') || text.includes('metaverse')) return 'XR';
  if (text.includes('infra') || text.includes('docker') || text.includes('k8s')) return 'INFRA';
  if (text.includes('doc') || text.includes('wiki')) return 'DOCS';
  return 'CORE';
}

function buildIntegrationQueue(repos: any[]) {
  return repos.map((repo, i) => ({
    rank: i + 1,
    repo: repo.full_name,
    domain: classifyDomain(repo),
    visibility: repo.private ? 'private' : 'public',
    actions: [
      'extract_contracts',
      'compare_with_tamv_canon',
      'generate_diff_patch',
      'submit_audit_review',
      'stage_merge_candidate',
    ],
    tamvExecutionPolicy: 'audit_required',
  }));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const githubToken = Deno.env.get('GITHUB_API_TOKEN');
    const [profile, repos] = await Promise.all([fetchProfile(githubToken || undefined), fetchTopRepos(githubToken || undefined)]);

    const successCount = [profile, repos].filter((r) => r.status === 'success').length;
    const repoData = repos.status === 'success' ? repos.data || [] : [];

    return new Response(JSON.stringify({
      sync_status: 'completed',
      target_user: TARGET_USER,
      mode: githubToken ? 'authenticated-private+public' : 'public-only',
      scanned_at: new Date().toISOString(),
      sources_synced: successCount,
      total_top_repos: repoData.length,
      integration_queue: buildIntegrationQueue(repoData),
      repositories: repoData,
      profile: profile.data || null,
      next_sync: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      protocol: {
        auto_execute_code: false,
        requires_human_audit: true,
        governance: 'dao_transparent_but_non_financial_control',
      },
      raw_results: [profile, repos].map(({ source, status, error }) => ({ source, status, error })),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
