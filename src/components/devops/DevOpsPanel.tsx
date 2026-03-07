// ============================================================================
// TAMV MD-X4™ — DevOps Control Panel (Functional)
// Cubic Triage + Code Evolution + Rollback
// ============================================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Zap, RotateCcw, Search, AlertTriangle,
  CheckCircle2, XCircle, GitPullRequest, Loader2,
  Terminal, ArrowRight, FileCode, Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOmniKernel } from '@/lib/omni-kernel';
import type { MutationRequest } from '@/lib/omni-kernel';

const SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const REC_ICONS: Record<string, React.ReactNode> = {
  Fix: <Zap className="w-3 h-3" />,
  Skip: <ArrowRight className="w-3 h-3" />,
  Discuss: <Brain className="w-3 h-3" />,
};

export const DevOpsPanel = () => {
  const {
    runCubicTriage,
    cubicIssues,
    cubicLoading,
    requestEvolution,
    requestRollback,
    eventLog,
  } = useOmniKernel();

  const [evolving, setEvolving] = useState(false);
  const [lastEvolution, setLastEvolution] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'triage' | 'evolve' | 'log'>('triage');

  // ── Evolution form state ──
  const [evoName, setEvoName] = useState('');
  const [evoPath, setEvoPath] = useState('/api/');
  const [evoMethod, setEvoMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [evoDesc, setEvoDesc] = useState('');

  const handleEvolve = async () => {
    if (!evoName || !evoDesc) return;
    setEvolving(true);
    const req: MutationRequest = {
      type: 'CODE_EVOLUTION',
      name: evoName,
      dsl: {
        method: evoMethod,
        path: evoPath,
        description: evoDesc,
        inputSchema: {},
        outputSchema: {},
      },
    };
    const result = await requestEvolution(req);
    setLastEvolution(result?.prUrl || result?.status || 'Unknown');
    setEvolving(false);
  };

  const handleRollback = async () => {
    await requestRollback({ prNumber: 1 });
  };

  const tabs = [
    { id: 'triage' as const, label: 'Cubic Triage', icon: <Search className="w-4 h-4" /> },
    { id: 'evolve' as const, label: 'Code Evolution', icon: <Zap className="w-4 h-4" /> },
    { id: 'log' as const, label: 'Event Log', icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-2 p-1 rounded-xl bg-card/50 border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Cubic Triage Tab ── */}
        {activeTab === 'triage' && (
          <motion.div
            key="triage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Cubic Code Analysis
              </h3>
              <Button
                onClick={runCubicTriage}
                disabled={cubicLoading}
                size="sm"
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
              >
                {cubicLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {cubicLoading ? 'Analyzing…' : 'Run Triage'}
              </Button>
            </div>

            {cubicIssues.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No issues found. Click <strong>Run Triage</strong> to scan.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cubicIssues.map((issue) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl bg-card border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge className={`text-xs ${SEVERITY_COLORS[issue.severity]}`}>
                            {issue.severity === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {issue.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono truncate">
                            {issue.file}:{issue.line}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{issue.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{issue.reasoning}</p>
                      </div>
                      <Badge
                        className={`shrink-0 text-xs flex items-center gap-1 ${
                          issue.recommendation === 'Fix'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : issue.recommendation === 'Skip'
                            ? 'bg-white/10 text-white/60'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {REC_ICONS[issue.recommendation]}
                        {issue.recommendation}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Code Evolution Tab ── */}
        {activeTab === 'evolve' && (
          <motion.div
            key="evolve"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Singularity — Code Evolution
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Evolution Name</label>
                <input
                  type="text"
                  value={evoName}
                  onChange={(e) => setEvoName(e.target.value)}
                  placeholder="e.g. OptimizeWalletTransfer"
                  className="w-full px-3 py-2 rounded-lg bg-card border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">API Path</label>
                <input
                  type="text"
                  value={evoPath}
                  onChange={(e) => setEvoPath(e.target.value)}
                  placeholder="/api/wallet/optimize"
                  className="w-full px-3 py-2 rounded-lg bg-card border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">HTTP Method</label>
                <select
                  value={evoMethod}
                  onChange={(e) => setEvoMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary/50"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                <input
                  type="text"
                  value={evoDesc}
                  onChange={(e) => setEvoDesc(e.target.value)}
                  placeholder="Describe what this endpoint does"
                  className="w-full px-3 py-2 rounded-lg bg-card border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleEvolve}
                disabled={evolving || !evoName || !evoDesc}
                className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-400 border border-amber-500/30"
              >
                {evolving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <GitPullRequest className="w-4 h-4 mr-2" />
                )}
                {evolving ? 'Isabella Analyzing…' : 'Request Evolution'}
              </Button>

              <Button
                onClick={handleRollback}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Rollback Last
              </Button>
            </div>

            {lastEvolution && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
              >
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Evolution queued: {lastEvolution}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Event Log Tab ── */}
        {activeTab === 'log' && (
          <motion.div
            key="log"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              OMNI-KERNEL Event Log
            </h3>

            <div className="max-h-96 overflow-y-auto rounded-xl bg-card border border-white/5 p-4 font-mono text-xs space-y-1">
              {eventLog.length === 0 ? (
                <p className="text-muted-foreground">No events yet. Interact with the system to generate logs.</p>
              ) : (
                eventLog.map((entry, i) => (
                  <div key={i} className="text-muted-foreground hover:text-foreground transition-colors">
                    {entry}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
