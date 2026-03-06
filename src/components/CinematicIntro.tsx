// =======================================================
// TAMV ESLint Plugin + CINEMATIC INTRO – Reinforced Edition
// =======================================================

/**
 * ESLint Plugin TAMV - Constitutional Quality Control
 * QC-TAMV-01 v1.1 Implementation
 * 
 * This plugin enforces the invariant laws of the TAMV Civilizatory Client
 */

import path from "node:path";

/**
 * L1 - Root único
 * ReactDOM.createRoot only allowed in src/main.tsx
 */
const noReactDOMOutsideMain = {
  meta: {
    type: 'problem',
    docs: {
      description: 'ReactDOM.createRoot only allowed in src/main.tsx (L1 - Root único)',
      category: 'TAMV Constitutional',
      recommended: 'error',
    },
    messages: {
      invalidRoot: 'L1 Violation: ReactDOM.createRoot is only allowed in src/main.tsx. Found in {{file}}',
    },
    schema: [],
  },
  create(context) {
    const filePath = context.getFilename();
    const normalizedPath = path.normalize(filePath);
    const isMainFile = normalizedPath.endsWith(path.join('src', 'main.tsx')) || 
                       normalizedPath.endsWith(path.join('src', 'main.ts'));
    
    return {
      CallExpression(node) {
        if (
          node.callee && 
          (node.callee as any).object && 
          (node.callee as any).object.name === 'ReactDOM' && 
          (node.callee as any).property && 
          (node.callee as any).property.name === 'createRoot'
        ) {
          if (!isMainFile) {
            context.report({
              node,
              messageId: 'invalidRoot',
              data: {
                file: path.basename(filePath),
              },
            });
          }
        }
      },
      ImportDeclaration(node) {
        if (node.source && node.source.value === 'react-dom/client') {
          if (!isMainFile) {
            context.report({
              node,
              messageId: 'invalidRoot',
              data: {
                file: path.basename(filePath),
              },
            });
          }
        }
      },
    };
  },
};

/**
 * L2 - Router único
 * BrowserRouter only allowed in src/App.tsx
 */
const noRouterOutsideApp = {
  meta: {
    type: 'problem',
    docs: {
      description: 'BrowserRouter only allowed in src/App.tsx (L2 - Router único)',
      category: 'TAMV Constitutional',
      recommended: 'error',
    },
    messages: {
      invalidRouter: 'L2 Violation: BrowserRouter is only allowed in src/App.tsx. Found in {{file}}',
    },
    schema: [],
  },
  create(context) {
    const filePath = context.getFilename();
    const normalizedPath = path.normalize(filePath);
    const isAppFile = normalizedPath.endsWith(path.join('src', 'App.tsx')) || 
                      normalizedPath.endsWith(path.join('src', 'App.ts'));
    
    return {
      JSXElement(node) {
        const opening = (node as any).openingElement;
        const name = opening?.name?.name;
        if (name === 'BrowserRouter' || name === 'Router') {
          if (!isAppFile) {
            context.report({
              node,
              messageId: 'invalidRouter',
              data: {
                file: path.basename(filePath),
              },
            });
          }
        }
      },
      CallExpression(node) {
        if ((node.callee as any)?.name === 'createBrowserRouter') {
          if (!isAppFile) {
            context.report({
              node,
              messageId: 'invalidRouter',
              data: {
                file: path.basename(filePath),
              },
            });
          }
        }
      },
    };
  },
};

/**
 * L3 - Layout único
 * Layout component only allowed in src/App.tsx
 */
const noLayoutOutsideApp = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Layout component only allowed in src/App.tsx (L3 - Layout único)',
      category: 'TAMV Constitutional',
      recommended: 'error',
    },
    messages: {
      invalidLayout: 'L3 Violation: Layout component is only allowed in src/App.tsx. Found in {{file}}',
      invalidLayoutImport: 'L3 Violation: Importing Layout from core/Layout is only allowed in src/App.tsx. Found in {{file}}',
    },
    schema: [],
  },
  create(context) {
    const filePath = context.getFilename();
    const normalizedPath = path.normalize(filePath);
    const isAppFile = normalizedPath.endsWith(path.join('src', 'App.tsx')) || 
                      normalizedPath.endsWith(path.join('src', 'App.ts'));
    
    return {
      ImportDeclaration(node) {
        if (
          node.source && 
          typeof node.source.value === 'string' && 
          (node.source.value.includes('core/Layout') || 
           node.source.value.includes('components/Layout'))
        ) {
          if (!isAppFile) {
            context.report({
              node,
              messageId: 'invalidLayoutImport',
              data: {
                file: path.basename(filePath),
              },
            });
          }
        }
      },
      JSXElement(node) {
        const opening = (node as any).openingElement;
        const name = opening?.name?.name;
        if (name === 'Layout') {
          if (!isAppFile) {
            context.report({
              node,
              messageId: 'invalidLayout',
              data: {
                file: path.basename(filePath),
              },
            });
          }
        }
      },
    };
  },
};

/**
 * L6 - Modules agnósticos de navegación
 * No react-router-dom imports in src/modules/*
 */
const noRouterInModules = {
  meta: {
    type: 'problem',
    docs: {
      description: 'No react-router-dom imports allowed in src/modules/* (L6 - Modules agnósticos)',
      category: 'TAMV Constitutional',
      recommended: 'error',
    },
    messages: {
      routerInModule: 'L6 Violation: react-router-dom imports are not allowed in modules. Found in {{file}}',
    },
    schema: [],
  },
  create(context) {
    const filePath = context.getFilename();
    const normalizedPath = path.normalize(filePath);
    const isModule = normalizedPath.includes(path.join('src', 'modules')) || 
                     normalizedPath.includes(path.join('src', 'components'));
    
    return {
      ImportDeclaration(node) {
        if (node.source && node.source.value === 'react-router-dom') {
          if (isModule) {
            context.report({
              node,
              messageId: 'routerInModule',
              data: {
                file: path.basename(filePath),
              },
            });
          }
        }
      },
    };
  },
};

/**
 * L4 - Correspondencia ruta-page
 * Pages cannot import other pages
 */
const noPageToPageImport = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Pages cannot import other pages (L4 - Correspondencia ruta-page)',
      category: 'TAMV Constitutional',
      recommended: 'error',
    },
    messages: {
      pageToPageImport: 'L4 Violation: Pages cannot import other pages. {{file}} imports from {{imported}}',
    },
    schema: [],
  },
  create(context) {
    const filePath = context.getFilename();
    const normalizedPath = path.normalize(filePath);
    const isPage = normalizedPath.includes(path.join('src', 'pages'));
    
    return {
      ImportDeclaration(node) {
        if (isPage && node.source && typeof node.source.value === 'string') {
          const importPath = node.source.value;
          if (importPath.includes('/pages/') || importPath.startsWith('@/pages/')) {
            context.report({
              node,
              messageId: 'pageToPageImport',
              data: {
                file: path.basename(filePath),
                imported: importPath,
              },
            });
          }
        }
      },
    };
  },
};

/**
 * L5 - Pages sin lógica de dominio
 * Pages should not contain business logic, side effects, or global state
 */
const noDomainLogicInPages = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Pages should not contain business logic, side effects, or global state (L5 - Pages sin lógica de dominio)',
      category: 'TAMV Constitutional',
      recommended: 'warn',
    },
    messages: {
      useEffectInPage: 'L5 Warning: useEffect with side effects detected in page. Consider moving to a module or domain.',
      useStateInPage: 'L5 Warning: Multiple useState hooks detected. Consider if this state belongs in a domain.',
      serviceImport: 'L5 Warning: Direct service import in page. Services should be initialized in integrations/ or domains/.',
    },
    schema: [],
  },
  create(context) {
    const filePath = context.getFilename();
    const normalizedPath = path.normalize(filePath);
    const isPage = normalizedPath.includes(path.join('src', 'pages'));
    
    let useStateCount = 0;
    
    return {
      CallExpression(node) {
        if (!isPage) return;
        
        if ((node.callee as any)?.name === 'useState') {
          useStateCount++;
          if (useStateCount > 3) {
            context.report({
              node,
              messageId: 'useStateInPage',
            });
          }
        }
        
        if ((node.callee as any)?.name === 'useEffect') {
          context.report({
            node,
            messageId: 'useEffectInPage',
          });
        }
      },
      ImportDeclaration(node) {
        if (!isPage) return;
        
        if (node.source && typeof node.source.value === 'string') {
          const importPath = node.source.value;
          if (
            importPath.includes('supabase') || 
            importPath.includes('services/') || 
            importPath.includes('api/')
          ) {
            context.report({
              node,
              messageId: 'serviceImport',
            });
          }
        }
      },
    };
  },
};

/**
 * TAMV Constitutional Rules
 * Prohibits DAO-related terminology and patterns
 */
const noDao = {
  meta: {
    type: 'problem',
    docs: {
      description: 'DAO is constitutionally prohibited in TAMV. Use SCAO or mark as [HISTORICAL]/[EXTERNAL].',
      category: 'TAMV Constitutional',
      recommended: 'error',
    },
    messages: {
      daoTerm: 'Constitutional Violation: DAO term prohibited. Use SCAO or mark as [HISTORICAL]/[EXTERNAL].',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const text = sourceCode.getText();
    const hasAllowedMark = /\[HISTORICAL\]|\[EXTERNAL\]|\[LEGACY\]/.test(text);

    if (hasAllowedMark) {
      return {};
    }

    const shouldReport = (value: string) => /\bDAOs?\b/i.test(value);

    return {
      Identifier(node) {
        if (shouldReport((node as any).name)) {
          context.report({ node, messageId: 'daoTerm' });
        }
      },
      Literal(node) {
        if (typeof (node as any).value === 'string' && shouldReport((node as any).value)) {
          context.report({ node, messageId: 'daoTerm' });
        }
      },
      TemplateElement(node) {
        if (shouldReport((node as any).value.raw)) {
          context.report({ node, messageId: 'daoTerm' });
        }
      },
    };
  },
};

/**
 * TAMV Constitutional Rules
 * Detects hidden economic logic without UI transparency
 */
const noHiddenEconomy = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Economic logic must have explicit UI transparency.',
      category: 'TAMV Constitutional',
      recommended: 'error',
    },
    messages: {
      hiddenEconomy: 'Constitutional Violation: Hidden economic logic detected. Must provide explicit UI transparency.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        const functionNames = ['processPayment', 'calculateFee', 'transferFunds', 'withdraw', 'deposit'];
        const callee = node.callee as any;
        const name = callee?.name || callee?.property?.name;
        const hasEconomicFunction = functionNames.some(fn => name && name.includes(fn));
        
        if (hasEconomicFunction) {
          const source = context.getSourceCode().getText();
          const hasUIReference = /tooltip|modal|dialog|notification|alert/.test(source.toLowerCase());
          
          if (!hasUIReference) {
            context.report({
              node,
              messageId: 'hiddenEconomy',
            });
          }
        }
      },
    };
  },
};

/**
 * TAMV Constitutional Rules
 * Prohibits unaudited AI systems without proper logging
 */
const noUnauditedAi = {
  meta: {
    type: 'problem',
    docs: {
      description: 'AI systems must have proper logging and audit trails.',
      category: 'TAMV Constitutional',
      recommended: 'error',
    },
    messages: {
      unauditedAi: 'Constitutional Violation: Unaudited AI system detected. Must implement proper logging and audit trails.',
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const aiPatterns = /openai|anthropic|cohere|huggingface|llama|gpt|ai\//i;
        if (node.source && aiPatterns.test(node.source.value as string)) {
          const source = context.getSourceCode().getText();
          const hasLogging = /console\.log|logger|audit|logEvent/.test(source);
          
          if (!hasLogging) {
            context.report({
              node,
              messageId: 'unauditedAi',
            });
          }
        }
      },
    };
  },
};

const plugin = {
  rules: {
    'no-reactdom-outside-main': noReactDOMOutsideMain,
    'no-router-outside-app': noRouterOutsideApp,
    'no-layout-outside-app': noLayoutOutsideApp,
    'no-router-in-modules': noRouterInModules,
    'no-page-to-page-import': noPageToPageImport,
    'no-domain-logic-in-pages': noDomainLogicInPages,
    'no-dao': noDao,
    'no-hidden-economy': noHiddenEconomy,
    'no-unaudited-ai': noUnauditedAi,
  },
  configs: {
    recommended: {
      plugins: ['tamv'],
      rules: {
        'tamv/no-reactdom-outside-main': 'error',
        'tamv/no-router-outside-app': 'error',
        'tamv/no-layout-outside-app': 'error',
        'tamv/no-router-in-modules': 'error',
        'tamv/no-page-to-page-import': 'error',
        'tamv/no-domain-logic-in-pages': 'warn',
        'tamv/no-dao': 'error',
        'tamv/no-hidden-economy': 'error',
        'tamv/no-unaudited-ai': 'error',
      },
    },
  },
};

export default plugin;

// =======================================================
// TAMV CINEMATIC INTRO – Creator LATAM Edition
// =======================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import introAudio from "@/assets/intro.mp3";
import logoImg from "@/assets/LOGOTAMV2.jpg";

interface CinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
  autoStart?: boolean;
}

const TOTAL_DURATION = 20; // segundos duros, pero intensos
const MAX_INTRO_TIME = 22000; // watchdog extra para no bloquear nunca

// Overlay de grano / textura
const CinematicOverlay: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden opacity-[0.04] mix-blend-soft-light">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
  </div>
);

// =======================================================
// PERMISSION GATE reforzado (no bloquea jamás)
// =======================================================

const PermissionGate: React.FC<{ onAccept: () => void }> = ({ onAccept }) => (
  <motion.div
    className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center"
    exit={{ opacity: 0, filter: "blur(20px)" }}
    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute inset-0 blur-2xl bg-white/5 rounded-full" />
      <img
        src={logoImg}
        alt="TAMV"
        className="w-24 h-24 object-contain rounded-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-1700"
      />
    </motion.div>

    <div className="mt-8 text-center">
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-white font-black text-4xl tracking-[0.3em] mb-2 italic"
      >
        TAMV
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-white/30 text-[10px] uppercase tracking-[0.5em] font-light"
      >
        La nueva casa de los creadores inconformes de LATAM
      </motion.p>
    </div>

    <motion.button
      onClick={onAccept}
      className="mt-10 group relative py-3 px-10 overflow-hidden border border-white/20 rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      whileHover={{ borderColor: "rgba(255,255,255,0.6)" }}
    >
      <span className="relative z-10 text-white text-[10px] tracking-[0.35em] uppercase group-hover:text-black transition-colors">
        Iniciar secuencia
      </span>
      <motion.div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
    </motion.button>
  </motion.div>
);

// =======================================================
// ESCENAS NUEVAS (creador LATAM / MD-X4 / Ignición)
// =======================================================

type SceneId = 0 | 1 | 2 | 3;

const SceneLogoIntro: React.FC = () => (
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center bg-black"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        filter: [
          "drop-shadow(0 0 0px #fff)",
          "drop-shadow(0 0 20px rgba(255,255,255,0.16))",
          "drop-shadow(0 0 0px #fff)",
        ],
      }}
      transition={{ duration: 6, repeat: Infinity }}
    >
      <img src={logoImg} alt="TAMV" className="w-28 h-28 rounded-3xl object-contain mb-6" />
    </motion.div>
    <h2 className="text-white/80 text-base font-light tracking-[0.4em] uppercase">
      Creator Economy / LATAM 2026
    </h2>
    <p className="mt-4 text-xs text-white/40 max-w-xs text-center tracking-[0.2em] uppercase">
      No venimos a pedir espacio. Venimos a construirlo.
    </p>
  </motion.div>
);

const SceneCollapse: React.FC = () => (
  <motion.div
    className="absolute inset-0 flex flex-col md:flex-row bg-black"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex-1 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10 px-6 py-10">
      <div className="max-w-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-3">
          LA REALIDAD HOY
        </p>
        <p className="text-sm text-white/70">
          18.9M creadores en LATAM viviendo bajo algoritmos que priorizan anuncios, no
          comunidades. [web:18]
        </p>
        <p className="mt-3 text-xs text-red-500/80 uppercase tracking-[0.3em]">
          La mayoría cobra centavos por horas de trabajo creativo. [web:19]
        </p>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="max-w-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-3">
          EL COSTO OCULTO
        </p>
        <p className="text-sm text-white/70">
          Datos personales extraídos, decisiones tomadas por modelos cerrados y cero control
          sobre el destino de tu comunidad. [web:16][web:20]
        </p>
        <p className="mt-3 text-xs text-white/50">
          El TAMV nace como infraestructura de escape, no como otra timeline infinita.
        </p>
      </div>
    </div>
  </motion.div>
);

const SceneCoreMDX4: React.FC = () => (
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center bg-radial from-[#0b0219] via-black to-black"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="relative h-64 w-64 sm:h-80 sm:w-80">
      <div className="absolute inset-10 rounded-full border border-white/10" />
      <div className="absolute inset-16 rounded-full border border-[#ff4f9a]/35" />
      <div className="absolute inset-22 rounded-full border border-[#4ff6ff]/35" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-3xl sm:text-4xl font-semibold tracking-[0.25em]">
          TAMV
        </div>
      </div>
      <SceneRingLabel label="Identidad" className="top-2 left-1/2 -translate-x-1/2" />
      <SceneRingLabel label="Membresías" className="right-2 top-1/2 -translate-y-1/2" />
      <SceneRingLabel label="Economía" className="bottom-2 left-1/2 -translate-x-1/2" />
      <SceneRingLabel label="IA" className="left-2 top-1/2 -translate-y-1/2" />
      <SceneRingLabel
        label="Gobernanza"
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-[140%]"
      />
    </div>
    <p className="mt-6 max-w-xl text-center text-sm sm:text-base text-white/70">
      Arquitectura MD‑X4: el núcleo donde identidad, comunidad, monetización e IA se alinean
      para servir al creador, no al algoritmo.
    </p>
  </motion.div>
);

const SceneRingLabel: React.FC<{ label: string; className?: string }> = ({
  label,
  className,
}) => (
  <div
    className={
      "absolute text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/60 " +
      (className ?? "")
    }
  >
    {label}
  </div>
);

const SceneCreatorImpact: React.FC = () => (
  <motion.div
    className="absolute inset-0 flex flex-col md:flex-row bg-black"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex-1 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
      <div className="max-w-sm p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">
          CREATOR HUD · EJEMPLO
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
          <div className="flex justify-between text-xs text-white/70">
            <span>Creador LATAM · Nivel 3</span>
            <span className="text-white/50">TAMV MD‑X4</span>
          </div>
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-[11px] text-white/50 uppercase tracking-[0.2em]">
                Miembros activos
              </div>
              <div className="text-2xl font-semibold">1,245</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-white/50 uppercase tracking-[0.2em]">
                ARPU ilustrativo
              </div>
              <div className="text-xl font-semibold">$35 USD</div>
            </div>
          </div>
          <p className="text-[10px] text-white/40 mt-1">
            Valores de ejemplo. No representan promesas de rendimiento individual.
          </p>
        </div>
        <p className="mt-4 text-xs sm:text-sm text-white/70">
          El TAMV existe para maximizar la parte del valor que captura el creador, conectando
          herramientas, comunidad y economía en un solo ecosistema.
        </p>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-xs p-6 text-center space-y-3">
        <p className="text-sm sm:text-base text-white/80">
          Cada creador que migra arrastra comunidad, atención y flujo económico. El TAMV es la
          infraestructura que los recibe y coordina.
        </p>
        <p className="text-xs text-white/50">
          Tu historia deja de ser un hilo perdido en un feed infinito y se convierte en una
          ciudad digital construida alrededor de tu trabajo.
        </p>
      </div>
    </div>
  </motion.div>
);

const SceneIgnitionCall: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black via-[#05020b] to-black px-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="text-xs uppercase tracking-[0.35em] text-white/40 mb-4">
      SECUENCIA DE IGNICIÓN
    </div>
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center max-w-xl">
      Esto no es otra red social.
      <br />
      Es el ecosistema soberano para{" "}
      <span className="text-[#ff4f9a]">creadores inconformes de LATAM</span>.
    </h2>
    <p className="mt-4 max-w-md text-center text-sm sm:text-base text-white/70">
      Si estás aquí, no vienes a ver qué pasa. Vienes a decidir cómo se enciende.
    </p>
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <button
        onClick={onAction}
        className="rounded-full border border-white/40 bg-white text-black px-6 py-2 text-xs sm:text-sm uppercase tracking-[0.25em] hover:bg-[#ff4f9a] hover:border-[#ff4f9a] hover:text-white transition"
      >
        Soy creador inconforme
      </button>
      <button
        onClick={onAction}
        className="rounded-full border border-white/30 bg-white/5 px-6 py-2 text-xs sm:text-sm uppercase tracking-[0.25em] text-white hover:bg-white hover:text-black transition"
      >
        Quiero construir mi comunidad aquí
      </button>
    </div>
    <p className="mt-4 text-[10px] text-white/40 max-w-md text-center">
      TAMV ofrece infraestructura y herramientas. No garantiza resultados económicos
      específicos; cada creador construye su propia trayectoria.
    </p>
  </motion.div>
);

// =======================================================
// MAIN ENGINE COMPATIBLE CON TU FIRMA
// =======================================================

export function CinematicIntroEngine({
  onComplete,
  skipEnabled,
  autoStart,
}: CinematicIntroProps) {
  const [accepted, setAccepted] = useState(!!autoStart);
  const [time, setTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progress = useSpring(0, { stiffness: 40, damping: 20 });
  const watchdogRef = useRef<number | null>(null);

  useEffect(() => {
    if (!accepted || completed) return;

    let lastTime = performance.now();
    let frameId: number;

    const loop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setTime((prev) => {
        const next = prev + delta;
        if (next >= TOTAL_DURATION) {
          setCompleted(true);
          return TOTAL_DURATION;
        }
        return next;
      });
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
    }
    watchdogRef.current = window.setTimeout(() => {
      setCompleted(true);
    }, MAX_INTRO_TIME);

    return () => {
      cancelAnimationFrame(frameId);
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
    };
  }, [accepted, completed]);

  useEffect(() => {
    progress.set(time / TOTAL_DURATION);
  }, [time, progress]);

  const initAudio = useCallback(async () => {
    try {
      const audio = new Audio(introAudio);
      audio.volume = 0.7;
      audioRef.current = audio;
      await audio.play();
    } catch {
      // Si falla, seguimos sin audio
    }
  }, []);

  const scene = useMemo<SceneId>(() => {
    if (time < 4) return 0;
    if (time < 9) return 1;
    if (time < 14) return 2;
    return 3;
  }, [time]);

  // salida garantizada
  useEffect(() => {
    if (completed) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      onComplete();
    }
  }, [completed, onComplete]);

  if (!accepted) {
    return (
      <PermissionGate
        onAccept={() => {
          setAccepted(true);
          void initAudio();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[9999] font-sans text-white select-none">
      <CinematicOverlay />

      <AnimatePresence mode="wait">
        {scene === 0 && <SceneLogoIntro key="scene-0" />}
        {scene === 1 && <SceneCollapse key="scene-1" />}
        {scene === 2 && <SceneCoreMDX4 key="scene-2" />}
        {scene === 3 && <SceneCreatorImpact key="scene-3" />}
        {scene === 3 && <SceneIgnitionCall key="scene-4" onAction={() => setCompleted(true)} />}
      </AnimatePresence>

      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div
          className="h-full bg-white/40"
          style={{ width: useTransform(progress, [0, 1], ["0%", "100%"]) }}
        />
      </div>

      {skipEnabled && (
        <button
          onClick={() => setCompleted(true)}
          className="absolute bottom-8 right-8 text-[9px] uppercase tracking-[0.5em] text-white/25 hover:text-white transition-colors"
        >
          SALTAR_SECUENCIA
        </button>
      )}
    </div>
  );
}

// Mantener export default con la misma firma que usas en el TAMV
export default function CinematicIntro(props: CinematicIntroProps) {
  return <CinematicIntroEngine {...props} />;
}
