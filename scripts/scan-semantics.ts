#!/usr/bin/env node

/**
 * TAMV Constitutional Semantic Scanner
 * QC-TAMV-GOV-01 Implementation
 * 
 * This script scans codebase for semantic patterns that violate the constitutional framework.
 * It detects intentions rather than just keywords, preventing camouflaged DAO/anti-constitutional patterns.
 */

import fs from 'fs';
import path from 'path';

const SEMANTIC_PATTERNS = [
  // DAO-related patterns
  'governance token',
  'community treasury',
  'vote to change fees',
  'DAO-like',
  'decentralized governance without custodian',
  'on-chain governance',
  'token-based voting',
  'smart contract governance',
  
  // Economic exploitation patterns
  'hidden fee',
  'surprise charge',
  'automatic renewal without consent',
  'price discrimination',
  'predatory pricing',
  
  // Cognitive manipulation patterns
  'dark pattern',
  'misleading UI',
  'coercive design',
  'deceptive pattern',
  'trick question',
  
  // AI sovereignty patterns
  'AI decides',
  'AI governance',
  'AI makes decisions',
  'autonomous AI',
  'AI sovereignty'
];

const EXCLUDE_DIRS = ['node_modules', 'dist', '.git', 'public', 'build'];

function scanFile(filePath: string): string[] {
  const violations: string[] = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lowerContent = content.toLowerCase();
    
    SEMANTIC_PATTERNS.forEach(pattern => {
      const patternLower = pattern.toLowerCase();
      if (lowerContent.includes(patternLower)) {
        // Check for valid historical markings
        const hasValidMarking = /\[HISTORICAL\]|\[EXTERNAL\]|\[LEGACY\]/.test(content);
        if (!hasValidMarking) {
          violations.push(pattern);
        }
      }
    });
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
  }
  
  return violations;
}

function scanDirectory(dirPath: string, results: Map<string, string[]>): void {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        scanDirectory(fullPath, results);
      }
    } else if (stats.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.md'))) {
      const violations = scanFile(fullPath);
      if (violations.length > 0) {
        results.set(fullPath, violations);
      }
    }
  });
}

function main() {
  const projectRoot = process.cwd();
  const results = new Map<string, string[]>();
  
  console.log('🔍 TAMV Constitutional Semantic Scanner');
  console.log('====================================');
  console.log(`Scanning: ${projectRoot}`);
  console.log();
  
  scanDirectory(projectRoot, results);
  
  if (results.size === 0) {
    console.log('✅ No semantic violations detected');
    process.exit(0);
  }
  
  console.log('❌ Semantic violations detected:');
  console.log('--------------------------------');
  
  results.forEach((violations, filePath) => {
    const relativePath = path.relative(projectRoot, filePath);
    console.log(`\n📄 ${relativePath}:`);
    violations.forEach(violation => {
      console.log(`   • ${violation}`);
    });
  });
  
  console.log();
  console.log(`Total files with violations: ${results.size}`);
  
  process.exit(1);
}

if (require.main === module) {
  main();
}

export { scanFile, scanDirectory, SEMANTIC_PATTERNS };
