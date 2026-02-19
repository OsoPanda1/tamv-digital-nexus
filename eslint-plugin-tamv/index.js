/**
 * ESLint Plugin TAMV - Constitutional Quality Control
 * QC-TAMV-01 v1.1 Implementation
 * 
 * This plugin enforces the invariant laws of the TAMV Civilizatory Client
 */

const path = require('path');

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
        if (node.callee && 
            node.callee.object && 
            node.callee.object.name === 'ReactDOM' && 
            node.callee.property && 
            node.callee.property.name === 'createRoot') {
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
        if (node.openingElement && 
            node.openingElement.name && 
            (node.openingElement.name.name === 'BrowserRouter' || 
             node.openingElement.name.name === 'Router')) {
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
        if (node.callee && 
            node.callee.name === 'createBrowserRouter') {
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
        if (node.source && 
            typeof node.source.value === 'string' && 
            (node.source.value.includes('core/Layout') || 
             node.source.value.includes('components/Layout'))) {
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
        if (node.openingElement && 
            node.openingElement.name && 
            node.openingElement.name.name === 'Layout') {
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
        if (node.source && 
            node.source.value === 'react-router-dom') {
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
        
        // Check for useState
        if (node.callee && node.callee.name === 'useState') {
          useStateCount++;
          if (useStateCount > 3) {
            context.report({
              node,
              messageId: 'useStateInPage',
            });
          }
        }
        
        // Check for useEffect with potential side effects
        if (node.callee && node.callee.name === 'useEffect') {
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
          if (importPath.includes('supabase') || 
              importPath.includes('services/') || 
              importPath.includes('api/')) {
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
    return {
      Program(node) {
        const source = context.getSourceCode().getText();
        if (/\bDAO\b|\bDAOs\b/i.test(source)) {
          // Check if it's properly marked
          const hasHistoricalMark = /\[HISTORICAL\]|\[EXTERNAL\]|\[LEGACY\]/.test(source);
          if (!hasHistoricalMark) {
            context.report({
              node,
              messageId: 'daoTerm',
            });
          }
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
        // Detect potential hidden economic operations
        const functionNames = ['processPayment', 'calculateFee', 'transferFunds', 'withdraw', 'deposit'];
        const hasEconomicFunction = functionNames.some(name => 
          (node.callee.name && node.callee.name.includes(name)) ||
          (node.callee.property && node.callee.property.name && node.callee.property.name.includes(name))
        );
        
        if (hasEconomicFunction) {
          // Check if there's corresponding UI logic
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
        // Detect AI-related imports
        const aiPatterns = /openai|anthropic|cohere|huggingface|llama|gpt|ai\//;
        if (node.source && aiPatterns.test(node.source.value)) {
          // Check if logging is implemented
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

module.exports = {
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
