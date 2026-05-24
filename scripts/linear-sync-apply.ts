#!/usr/bin/env tsx

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type SyncStatus = 'planned' | 'linked' | 'in_progress' | 'blocked' | 'done';

interface LinearRepoPayload {
  tamv_repo_key: string;
  slot: number;
  repo_name: string;
  repo_url: string;
  classification: string;
  ingest_status: string;
  linear_sync_status: SyncStatus;
  linear_project_name: string;
  linear_epic_title: string;
  labels: string[];
  issues_template: string[];
}

interface PayloadFile {
  generated_at_utc: string;
  payload: LinearRepoPayload[];
}

const LINEAR_API_URL = 'https://api.linear.app/graphql';
const DEFAULT_PAYLOAD_PATH = 'docs/repo-unification/generated/linear-sync-payload.json';

async function gql<T>(query: string, variables: Record<string, unknown>, apiKey: string): Promise<T> {
  const res = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Linear API HTTP ${res.status}: ${text}`);
  }

  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) {
    throw new Error(`Linear GraphQL error: ${json.errors.map((e) => e.message).join('; ')}`);
  }
  if (!json.data) {
    throw new Error('Linear GraphQL error: empty data');
  }

  return json.data;
}

async function getTeamIdByKey(teamKey: string, apiKey: string): Promise<string> {
  const data = await gql<{ teams: { nodes: Array<{ id: string; key: string }> } }>(
    `query Teams($key: String!) { teams(filter: { key: { eq: $key } }) { nodes { id key } } }`,
    { key: teamKey },
    apiKey,
  );

  const team = data.teams.nodes[0];
  if (!team) throw new Error(`No team found for LINEAR_TEAM_KEY=${teamKey}`);
  return team.id;
}

async function getOrCreateProjectId(name: string, teamId: string, apiKey: string, dryRun: boolean): Promise<string> {
  const q = await gql<{ projects: { nodes: Array<{ id: string; name: string }> } }>(
    `query Projects($name: String!) { projects(filter: { name: { eq: $name } }) { nodes { id name } } }`,
    { name },
    apiKey,
  );

  if (q.projects.nodes[0]) return q.projects.nodes[0].id;
  if (dryRun) return `dryrun-project:${name}`;

  const c = await gql<{ projectCreate: { success: boolean; project: { id: string } | null } }>(
    `mutation ProjectCreate($input: ProjectCreateInput!) { projectCreate(input: $input) { success project { id } } }`,
    { input: { name, teamIds: [teamId] } },
    apiKey,
  );

  if (!c.projectCreate.success || !c.projectCreate.project?.id) {
    throw new Error(`Unable to create project ${name}`);
  }

  return c.projectCreate.project.id;
}

async function getOrCreateIssueByTitle(
  title: string,
  teamId: string,
  projectId: string,
  description: string,
  labelNames: string[],
  apiKey: string,
  dryRun: boolean,
  parentId?: string,
): Promise<string> {
  if (dryRun) return `dryrun-issue:${title}`;

  const q = await gql<{ issues: { nodes: Array<{ id: string; title: string }> } }>(
    `query Issues($title: String!, $teamId: ID!) { issues(filter: { title: { eq: $title }, team: { id: { eq: $teamId } } }) { nodes { id title } } }`,
    { title, teamId },
    apiKey,
  );
  if (q.issues.nodes[0]) return q.issues.nodes[0].id;

  const c = await gql<{ issueCreate: { success: boolean; issue: { id: string } | null } }>(
    `mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) { success issue { id } }
    }`,
    {
      input: {
        teamId,
        projectId,
        title,
        description,
        labelNames,
        parentId,
      },
    },
    apiKey,
  );

  if (!c.issueCreate.success || !c.issueCreate.issue?.id) {
    throw new Error(`Unable to create issue ${title}`);
  }

  return c.issueCreate.issue.id;
}

function loadPayload(pathArg?: string): PayloadFile {
  const payloadPath = resolve(process.cwd(), pathArg ?? DEFAULT_PAYLOAD_PATH);
  const file = JSON.parse(readFileSync(payloadPath, 'utf8')) as PayloadFile;
  if (!Array.isArray(file.payload)) throw new Error(`Invalid payload file: ${payloadPath}`);
  return file;
}

async function main(): Promise<void> {
  const payloadPathArg = process.argv[2];
  const dryRun = process.env.LINEAR_DRY_RUN !== 'false';
  const apiKey = process.env.LINEAR_API_KEY;
  const teamKey = process.env.LINEAR_TEAM_KEY ?? 'TAMV';
  const explicitProjectId = process.env.LINEAR_PROJECT_ID;

  if (!dryRun && !apiKey) {
    throw new Error('LINEAR_API_KEY is required when LINEAR_DRY_RUN=false');
  }

  const payloadFile = loadPayload(payloadPathArg);
  if (payloadFile.payload.length === 0) {
    console.log('No payload records to process.');
    return;
  }

  const safeApiKey = apiKey ?? '';
  const teamId = dryRun ? `dryrun-team:${teamKey}` : await getTeamIdByKey(teamKey, safeApiKey);

  for (const repo of payloadFile.payload) {
    const projectId = dryRun
      ? (explicitProjectId ?? `dryrun-project:${repo.linear_project_name}`)
      : (explicitProjectId ?? (await getOrCreateProjectId(repo.linear_project_name, teamId, safeApiKey, dryRun)));

    const epicDescription = [
      `TAMV Repo Key: ${repo.tamv_repo_key}`,
      `Repo URL: ${repo.repo_url}`,
      `Classification: ${repo.classification}`,
      `Ingest Status: ${repo.ingest_status}`,
    ].join('\n');

    const epicId = await getOrCreateIssueByTitle(
      repo.linear_epic_title,
      teamId,
      projectId,
      epicDescription,
      [...repo.labels, 'tamv-type:epic'],
      safeApiKey,
      dryRun,
    );

    for (const stage of repo.issues_template) {
      const title = `[${repo.tamv_repo_key}] ${stage}`;
      const description = `${stage}\n\nParent Epic: ${repo.linear_epic_title}\nRepo: ${repo.repo_url}`;
      await getOrCreateIssueByTitle(
        title,
        teamId,
        projectId,
        description,
        [...repo.labels, 'tamv-type:stage'],
        safeApiKey,
        dryRun,
        epicId,
      );
    }

    console.log(`Processed ${repo.tamv_repo_key} -> project=${projectId} epic=${epicId}`);
  }

  console.log(`Done. mode=${dryRun ? 'dry-run' : 'apply'} records=${payloadFile.payload.length}`);
}

main().catch((err) => {
  console.error(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
