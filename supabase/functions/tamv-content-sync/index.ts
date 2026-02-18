import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SOURCES = [
  { name: 'github-profile', url: 'https://api.github.com/users/OsoPanda1' },
  { name: 'github-repos', url: 'https://api.github.com/users/OsoPanda1/repos?sort=updated&per_page=30' },
  { name: 'tamv-universe', url: 'https://api.github.com/repos/OsoPanda1/tamv-universe-online' },
  { name: 'tamv-metanextgen', url: 'https://api.github.com/repos/OsoPanda1/tamvonline-metanextgen' },
  { name: 'web-4-genesis', url: 'https://api.github.com/repos/OsoPanda1/web-4.0-genesis' },
  { name: 'unify-nexus', url: 'https://api.github.com/repos/OsoPanda1/unify-nexus-deployment' },
];

interface SyncResult {
  source: string;
  status: 'success' | 'error';
  data?: any;
  error?: string;
  timestamp: string;
}

async function fetchGitHubData(source: { name: string; url: string }): Promise<SyncResult> {
  try {
    const response = await fetch(source.url, {
      headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'TAMV-Content-Sync/1.0' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return { source: source.name, status: 'success', data, timestamp: new Date().toISOString() };
  } catch (error) {
    return { source: source.name, status: 'error', error: (error as Error).message, timestamp: new Date().toISOString() };
  }
}

async function fetchBlogContent(): Promise<SyncResult> {
  try {
    const response = await fetch('https://tamvonlinenetwork.blogspot.com/', {
      headers: { 'User-Agent': 'TAMV-Content-Sync/1.0' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    
    // Extract post titles and content snippets
    const titleRegex = /<h3 class='post-title[^']*'[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/gi;
    const titles: string[] = [];
    let match;
    while ((match = titleRegex.exec(html)) !== null) {
      titles.push(match[1].replace(/<[^>]*>/g, '').trim());
    }

    return {
      source: 'blog',
      status: 'success',
      data: { url: 'https://tamvonlinenetwork.blogspot.com', posts_found: titles.length, titles: titles.slice(0, 20) },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return { source: 'blog', status: 'error', error: (error as Error).message, timestamp: new Date().toISOString() };
  }
}

function filterAndStructure(results: SyncResult[]) {
  const githubProfile = results.find(r => r.source === 'github-profile')?.data;
  const repos = results.find(r => r.source === 'github-repos')?.data || [];
  const blog = results.find(r => r.source === 'blog')?.data;

  const tamvRepos = repos.filter((r: any) => 
    r.name?.toLowerCase().includes('tamv') || 
    r.name?.toLowerCase().includes('unify') || 
    r.name?.toLowerCase().includes('web-4') ||
    r.name?.toLowerCase().includes('anubis')
  );

  return {
    ecosystem: {
      founder: githubProfile?.bio || 'TAMV ONLINE NETWORK',
      location: githubProfile?.location || 'Pachuca Hidalgo, México',
      company: githubProfile?.company || 'TAMV Enterprise',
      total_repos: repos.length,
      tamv_repos: tamvRepos.length,
      contributions: githubProfile?.public_repos || 0,
    },
    repositories: tamvRepos.map((r: any) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      updated_at: r.updated_at,
      stars: r.stargazers_count,
      url: r.html_url,
      topics: r.topics || [],
    })),
    blog: blog || { posts_found: 0, titles: [] },
    sync_timestamp: new Date().toISOString(),
    next_sync: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[TAMV Content Sync] Starting sync cycle...');

    // Fetch all sources in parallel
    const [blogResult, ...githubResults] = await Promise.all([
      fetchBlogContent(),
      ...SOURCES.map(fetchGitHubData)
    ]);

    const allResults = [blogResult, ...githubResults];
    const structured = filterAndStructure(allResults);

    const successCount = allResults.filter(r => r.status === 'success').length;
    const errorCount = allResults.filter(r => r.status === 'error').length;

    console.log(`[TAMV Content Sync] Complete: ${successCount} success, ${errorCount} errors`);

    return new Response(JSON.stringify({
      sync_status: 'completed',
      sources_synced: successCount,
      sources_failed: errorCount,
      ecosystem_data: structured,
      raw_results: allResults.map(r => ({ source: r.source, status: r.status, error: r.error })),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[TAMV Content Sync] Error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
