#!/usr/bin/env tsx

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

interface RepoRegistryRow {
  slot: string;
  repo_name: string;
  repo_url: string;
  classification: string;
  status: string;
  notes: string;
}

interface LinearRepoPayload {
  tamv_repo_key: string;
  slot: number;
  repo_name: string;
  repo_url: string;
  classification: string;
  ingest_status: string;
  linear_sync_status: 'planned' | 'linked' | 'in_progress' | 'blocked' | 'done';
  linear_project_name: string;
  linear_epic_title: string;
  labels: string[];
  issues_template: string[];
}

const DEFAULT_REGISTRY = 'docs/repo-unification/REPO_REGISTRY_177.csv';
const DEFAULT_OUTPUT = 'docs/repo-unification/generated/linear-sync-payload.json';
const ALLOWED_CLASSIFICATIONS = new Set([
  'TAMV_REPO_CONFIRMED',
  'TAMV_REPO_POSSIBLE',
  'UNCERTAIN_TAMV_REPO',
  'NON_TAMV_REPO',
]);

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
      continue;
    }

    cur += ch;
  }

  out.push(cur);
  return out.map((v) => v.trim());
}

function parseCsv(content: string): RepoRegistryRow[] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj: Record<string, string> = {};

    headers.forEach((header, idx) => {
      obj[header] = values[idx] ?? '';
    });

    return {
      slot: obj.slot ?? '',
      repo_name: obj.repo_name ?? '',
      repo_url: obj.repo_url ?? '',
      classification: obj.classification ?? '',
      status: obj.status ?? '',
      notes: obj.notes ?? '',
    };
  });
}

function domainFromName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('security') || n.includes('guard') || n.includes('sentinel')) return 'security';
  if (n.includes('isabella') || n.includes('ai') || n.includes('sof')) return 'ia';
  if (n.includes('bookpi') || n.includes('utamv') || n.includes('online')) return 'online_edu';
  if (n.includes('wallet') || n.includes('payment') || n.includes('checkout') || n.includes('ledger')) return 'economy';
  if (n.includes('xr') || n.includes('render') || n.includes('3d') || n.includes('4d') || n.includes('mdx4')) return 'render';
  if (n.includes('api') || n.includes('infra') || n.includes('orchestrator')) return 'infra';
  return 'core';
}

function linearSyncStatusFromIngest(status: string): LinearRepoPayload['linear_sync_status'] {
  const s = status.toUpperCase();
  if (s.includes('DISCOVERED') || s.includes('PENDING')) return 'planned';
  if (s.includes('VALIDATED')) return 'in_progress';
  if (s.includes('ABSORBED') || s.includes('INTEGRATED')) return 'done';
  if (s.includes('REJECTED')) return 'blocked';
  return 'planned';
}

function buildPayload(rows: RepoRegistryRow[]): LinearRepoPayload[] {
  const issueTemplate = [
    'Discovery',
    'Scoring',
    'Sandbox Import',
    'Contract Fit',
    'Security/License Gate',
    'Merge + AuditBundle',
  ];

  return rows
    .filter((row) => ALLOWED_CLASSIFICATIONS.has(row.classification))
    .filter((row) => row.repo_name !== 'PENDING_DISCOVERY')
    .map((row) => {
      const slot = Number.parseInt(row.slot, 10);
      const slotSafe = Number.isNaN(slot) ? -1 : slot;
      const domain = domainFromName(row.repo_name);
      const classLabel = row.classification
        .replace('TAMV_REPO_', '')
        .replace('_TAMV_REPO', '')
        .toLowerCase();

      return {
        tamv_repo_key: `slot:${slotSafe}|repo:${row.repo_name}`,
        slot: slotSafe,
        repo_name: row.repo_name,
        repo_url: row.repo_url,
        classification: row.classification,
        ingest_status: row.status,
        linear_sync_status: linearSyncStatusFromIngest(row.status),
        linear_project_name: 'TAMV Repo Federation 177',
        linear_epic_title: `S${String(slotSafe).padStart(3, '0')} ${row.repo_name}`,
        labels: [`tamv-domain:${domain}`, `tamv-class:${classLabel}`, 'tamv-protocol:v1.0.0'],
        issues_template: issueTemplate,
      };
    })
    .sort((a, b) => a.slot - b.slot);
}

function main(): void {
  const registryPath = resolve(process.cwd(), process.argv[2] ?? DEFAULT_REGISTRY);
  const outputPath = resolve(process.cwd(), process.argv[3] ?? DEFAULT_OUTPUT);

  const csvContent = readFileSync(registryPath, 'utf8');
  const rows = parseCsv(csvContent);
  const payload = buildPayload(rows);

  const result = {
    generated_at_utc: new Date().toISOString(),
    source_registry: registryPath,
    total_rows: rows.length,
    exported_rows: payload.length,
    payload,
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

  console.log(`OK: generated ${payload.length} repo payload records -> ${outputPath}`);
}

main();
