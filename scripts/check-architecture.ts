#!/usr/bin/env ts-node
/**
 * TAMV Architecture Checker
 * QC-TAMV-01 v1.1 Implementation
 * 
 * This script validates the architectural invariants of the TAMV Civilizatory Client
 * by analyzing the dependency graph and detecting violations.
 * 
 * Usage: npm run check:architecture
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface DependencyNode {
  file: string;
  imports: string[];
  type: 'page' | 'module' | 'domain' | 'core' | 'integration' | 'unknown';
}

interface Violation {
  rule: string;
  severity: 'error' | 'warning';
  file: string;
  importPath: string;
  message: string;
}

interface ArchitectureReport {
  valid: boolean;
  violations: Violation[];
  stats: {
    totalFiles: number;
    pages: number;
    modules: number;
    domains: number;
    coreFiles: number;
    integrations: number;
  };
  timestamp: string;
}

// ============================================================================
// Configuration
// ============================================================================

const SRC_DIR = path.resolve(__dirname, '../src');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const MODULES_DIR = path.join(SRC_DIR, 'modules');
const DOMAINS_DIR = path.join(SRC_DIR, 'domains');
const CORE_DIR = path.join(SRC_DIR, 'core');
const INTEGRATIONS_DIR = path.join(SRC_DIR, 'integrations');

const ALLOWED_MAIN_FILES = ['main.tsx', 'main.ts'];
const ALLOWED_APP_FILES = ['App.tsx', 'App.ts'];

// ============================================================================
// Utility Functions
// ============================================================================

function getAllFiles(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, extensions));
    } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function getFileType(filePath: string): DependencyNode['type'] {
  const normalized = path.normalize(filePath);
  
  if (normalized.includes(path.join('src', 'pages'))) return 'page';
  if (normalized.includes(path.join('src', 'modules'))) return 'module';
  if (normalized.includes(path.join('src', 'domains'))) return 'domain';
  if (normalized.includes(path.join('src', 'core'))) return 'core';
  if (normalized.includes(path.join('src', 'integrations'))) return 'integration';
  
  return 'unknown';
}

function extractImports(content: string): string[] {
  const imports: string[] = [];
  
  // Match ES6 imports
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  // Match dynamic imports
  const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

function resolveImportPath(importPath: string, fromFile: string): string {
  // Handle @/ alias
  if (importPath.startsWith('@/')) {
    return path.join(SRC_DIR, importPath.slice(2));
  }
  
  // Handle relative imports
  if (importPath.startsWith('.')) {
    const fromDir = path.dirname(fromFile);
    return path.resolve(fromDir, importPath);
  }
  
  // External package
  return importPath;
}

// ============================================================================
// Rule Validators
// ============================================================================

function validateL1_RootUnico(files: string[], violations: Violation[]): void {
  console.log('  Checking L1 - Root único...');
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const fileName = path.basename(file);
    
    // Check for createRoot usage
    if (content.includes('createRoot') || content.includes('react-dom/client')) {
      if (!ALLOWED_MAIN_FILES.includes(fileName)) {
        violations.push({
          rule: 'L1',
          severity: 'error',
          file: path.relative(SRC_DIR, file),
          importPath: 'react-dom/client',
          message: `ReactDOM.createRoot found outside main.tsx in ${path.basename(file)}`,
        });
      }
    }
  }
}

function validateL2_RouterUnico(files: string[], violations: Violation[]): void {
  console.log('  Checking L2 - Router único...');
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const fileName = path.basename(file);
    
    // Check for BrowserRouter usage
    if (content.includes('BrowserRouter') || content.includes('createBrowserRouter')) {
      if (!ALLOWED_APP_FILES.includes(fileName)) {
        violations.push({
          rule: 'L2',
          severity: 'error',
          file: path.relative(SRC_DIR, file),
          importPath: 'react-router-dom',
          message: `BrowserRouter found outside App.tsx in ${path.basename(file)}`,
        });
      }
    }
  }
}

function validateL3_LayoutUnico(files: string[], violations: Violation[]): void {
  console.log('  Checking L3 - Layout único...');
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const fileName = path.basename(file);
    
    // Check for Layout imports
    if (content.includes('core/Layout') || content.includes('components/Layout')) {
      if (!ALLOWED_APP_FILES.includes(fileName)) {
        violations.push({
          rule: 'L3',
          severity: 'error',
          file: path.relative(SRC_DIR, file),
          importPath: 'Layout',
          message: `Layout import found outside App.tsx in ${path.basename(file)}`,
        });
      }
    }
  }
}

function validateL4_PageToPage(files: string[], violations: Violation[]): void {
  console.log('  Checking L4 - Correspondencia ruta-page...');
  
  const pageFiles = files.filter(f => getFileType(f) === 'page');
  
  for (const file of pageFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const imports = extractImports(content);
    
    for (const imp of imports) {
      if (imp.includes('/pages/') || imp.startsWith('@/pages/')) {
        violations.push({
          rule: 'L4',
          severity: 'error',
          file: path.relative(SRC_DIR, file),
          importPath: imp,
          message: `Page imports another page: ${imp}`,
        });
      }
    }
  }
}

function validateL6_ModulesAgnostic(files: string[], violations: Violation[]): void {
  console.log('  Checking L6 - Modules agnósticos de navegación...');
  
  const moduleFiles = files.filter(f => getFileType(f) === 'module');
  
  for (const file of moduleFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const imports = extractImports(content);
    
    for (const imp of imports) {
      if (imp === 'react-router-dom' || imp.includes('react-router-dom')) {
        violations.push({
          rule: 'L6',
          severity: 'error',
          file: path.relative(SRC_DIR, file),
          importPath: imp,
          message: `Module imports react-router-dom: ${imp}`,
        });
      }
      
      if (imp.includes('/pages/') || imp.startsWith('@/pages/')) {
        violations.push({
          rule: 'L6',
          severity: 'error',
          file: path.relative(SRC_DIR, file),
          importPath: imp,
          message: `Module imports a page: ${imp}`,
        });
      }
    }
  }
}

function validateL7_InicializacionControlada(files: string[], violations: Violation[]): void {
  console.log('  Checking L7 - Inicialización controlada...');
  
  const pageFiles = files.filter(f => getFileType(f) === 'page');
  
  for (const file of pageFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const imports = extractImports(content);
    
    for (const imp of imports) {
      if (imp.includes('supabase') && !imp.includes('types')) {
        violations.push({
          rule: 'L7',
          severity: 'warning',
          file: path.relative(SRC_DIR, file),
          importPath: imp,
          message: `Page directly imports Supabase. Services should be in integrations/`,
        });
      }
    }
  }
}

function validateDomainIsolation(files: string[], violations: Violation[]): void {
  console.log('  Checking Domain isolation...');
  
  const domainFiles = files.filter(f => getFileType(f) === 'domain');
  
  for (const file of domainFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const imports = extractImports(content);
    
    for (const imp of imports) {
      if (imp.includes('/pages/') || imp.startsWith('@/pages/')) {
        violations.push({
          rule: 'Domain',
          severity: 'error',
          file: path.relative(SRC_DIR, file),
          importPath: imp,
          message: `Domain imports a page: ${imp}`,
        });
      }
    }
  }
}

// ============================================================================
// Main Execution
// ============================================================================

function runArchitectureCheck(): ArchitectureReport {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║     TAMV Architecture Checker - QC-TAMV-01 v1.1              ║');
  console.log('║     Sistema Constitucional de Control de Calidad             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  const violations: Violation[] = [];
  
  // Collect all source files
  console.log('📁 Scanning source files...');
  const allFiles = getAllFiles(SRC_DIR);
  
  const stats = {
    totalFiles: allFiles.length,
    pages: allFiles.filter(f => getFileType(f) === 'page').length,
    modules: allFiles.filter(f => getFileType(f) === 'module').length,
    domains: allFiles.filter(f => getFileType(f) === 'domain').length,
    coreFiles: allFiles.filter(f => getFileType(f) === 'core').length,
    integrations: allFiles.filter(f => getFileType(f) === 'integration').length,
  };
  
  console.log(`   Found ${stats.totalFiles} source files`);
  console.log(`   - Pages: ${stats.pages}`);
  console.log(`   - Modules: ${stats.modules}`);
  console.log(`   - Domains: ${stats.domains}`);
  console.log(`   - Core: ${stats.coreFiles}`);
  console.log(`   - Integrations: ${stats.integrations}`);
  console.log('');
  
  // Run all validators
  console.log('🔍 Running architectural invariant checks...\n');
  
  validateL1_RootUnico(allFiles, violations);
  validateL2_RouterUnico(allFiles, violations);
  validateL3_LayoutUnico(allFiles, violations);
  validateL4_PageToPage(allFiles, violations);
  validateL6_ModulesAgnostic(allFiles, violations);
  validateL7_InicializacionControlada(allFiles, violations);
  validateDomainIsolation(allFiles, violations);
  
  // Generate report
  console.log('\n📊 Architecture Check Results:\n');
  
  const errors = violations.filter(v => v.severity === 'error');
  const warnings = violations.filter(v => v.severity === 'warning');
  
  if (errors.length > 0) {
    console.log('❌ ERRORS:\n');
    for (const error of errors) {
      console.log(`   [${error.rule}] ${error.file}`);
      console.log(`      ${error.message}`);
      console.log(`      Import: ${error.importPath}\n`);
    }
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    for (const warning of warnings) {
      console.log(`   [${warning.rule}] ${warning.file}`);
      console.log(`      ${warning.message}`);
      console.log(`      Import: ${warning.importPath}\n`);
    }
  }
  
  if (violations.length === 0) {
    console.log('✅ All architectural invariants validated successfully!\n');
  }
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`   Total: ${errors.length} errors, ${warnings.length} warnings`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  return {
    valid: errors.length === 0,
    violations,
    stats,
    timestamp: new Date().toISOString(),
  };
}

// Run the check
const report = runArchitectureCheck();

// Write report to file
const reportPath = path.resolve(__dirname, '../architecture-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📄 Report saved to: ${reportPath}\n`);

// Exit with appropriate code
process.exit(report.valid ? 0 : 1);
