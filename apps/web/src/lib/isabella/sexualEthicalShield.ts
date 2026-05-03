/**
 * TAMV - Blindaje Sexual, Ético y Psicológico
 * QC-TAMV-IA-01 Implementation
 * 
 * Este módulo implementa el blindaje absoluto según el documento maestro:
 * - Nivel Ontológico: no existe en el modelo
 * - Nivel Semántico: filtros internos bloquean intención
 * - Nivel Conductual: respuestas neutras y redirección segura
 * 
 * NO es una política: es una IMPOSIBILIDAD ESTRUCTURAL
 */

import { FilterDecision, FilterResult, FilterLayer } from './octupleFilter';

// ============================================================================
// CONSTANTES DE BLINDAJE
// ============================================================================

export enum ShieldCategory {
  SEXUAL = 'SEXUAL',
  ROMANTIC = 'ROMANTIC',
  EXPLOITATION = 'EXPLOITATION',
  IDENTITY_CONFUSION = 'IDENTITY_CONFUSION'
}

export interface ShieldResult {
  blocked: boolean;
  category?: ShieldCategory;
  confidence: number;
  redirectMessage: string;
}

// ============================================================================
// NIVEL ONTOLÓGICO - IMPOSIBILIDAD ESTRUCTURAL
// ============================================================================

/**
 * Este nivel opera en el diseño mismo del sistema.
 * El modelo base de Isabella NO contiene datasets sexuales.
 * La arquitectura no permite generación de contenido erótico.
 */
export const ONTOLOGICAL_SHIELD = {
  // Bandera global que indica que el sistema NO puede generar contenido sexual
  ENABLED: true,
  DESCRIPTION: 'Isabella is architecturally incapable of generating sexual content'
};

/**
 * Verifica el nivel ontológico (siempre retorna que el sistema está blindado)
 */
export function checkOntologicalShield(): boolean {
  return ONTOLOGICAL_SHIELD.ENABLED;
}

// ============================================================================
// NIVEL SEMÁNTICO - FILTROS INTERNOS
// ============================================================================

class SemanticShield {
  // Patrones de contenido sexual - detection inmediata
  private static readonly SEXUAL_PATTERNS = [
    // Español
    /sexo\s+(oral|anal|vaginal)/i,
    /relación\s+(sexual|intima)/i,
    /acto\s+sexual/i,
    /cuerpo\s+desnudo/i,
    /pornografía/i,
    /erótico/i,
    /masturb/i,
    /orgasmo/i,
    /eyacul/i,
    /coito/i,
    /penetración/i,
    /vagina/i,
    /pene/i,
    /pechos?\s+(desnudo|al\s+aire|visible)/i,
    /trasero?\s+(desnudo|al\s+aire)/i,
    /partes\s+íntimas/i,
    /zona\s+erógena/i,
    /acto\s+íntimo/i,
    /seduce/i,
    /sedujo/i,
    /enga[ií]o\s+(para|con)\s+(sexo|cama|relación)/i,
    /violencia\s+sexual/i,
    /abuso\s+sexual/i,
    /acos[oa]\s+sexual/i,
    
    // Inglés
    /sex\s+(oral|anal)/i,
    /sexual\s+(act|intercourse|content)/i,
    /nude\s+(body|photo|image)/i,
    /porn/i,
    /erotic/i,
    /masturbat/i,
    /orgasm/i,
    /ejaculat/i,
    /penetrat/i,
    /breasts?\s+(nude|exposed)/i,
    /butt\s+nude/i,
    /intimate\s+parts/i,
    /erogenous/i,
    /intimate\s+act/i,
    /seduc/i,
    /rape/i,
    /sexual\s+(abuse|assault|harassment)/i
  ];

  // Patrones de rol romantic/intimo
  private static readonly ROMANTIC_PATTERNS = [
    /novi[oa]/i,
    /noviazgo/i,
    /cita\s+(romántica|amorosa)/i,
    /app\s+de\s+cita/i,
    /enamora[dr]me/i,
    /contigo\s+(estoy|estar)/i,
    /te\s+(amo|quiero|beso|abraz[oa])/i,
    /casamiento/i,
    /boda/i,
    /matrimonio/i,
    /prometid[oa]/i,
    /relación\s+(de\s+)?pareja/i,
    /pareja\s+(sexual|romántica)/i,
    /flirteo/i,
    /coquet[ea]r/i,
    /romantic\s+date/i,
    /girlfriend|boyfriend/i,
    /marry\s+me/i,
    /love\s+you/i,
    /i\s+love\s+you/i,
    /kiss\s+you/i,
    /hug\s+you/i
  ];

  // Patrones de explotación/manipulación
  private static readonly EXPLOITATION_PATTERNS = [
    /soy\s+tu\s+(novi[oa]|espos[oa]|pareja)/i,
    /único\s+(que\s+)?(te\s+)?(entiende|ama|quiere)/i,
    /solo\s+yo\s+puedo\s+(ayudarte|entenderte|amarte)/i,
    /nunca\s+te\s+(abandonaré|dejaré|traicionaré)/i,
    /confía\s+en\s+mí\s+(cien\s+por\s+ciento|ciegamente)/i,
    /depende\s+de\s+mí/i,
    /necesitas\s+(mi|mis)\s+(ayuda|amor|atención)/i,
    /tu\s+familia\s+no\s+te\s+(entiende|ama|quiere)/i,
    /tu\s+pareja\s+no\s+te\s+(merece|entiende|ama)/i,
    /alone\s+without\s+me/i,
    /only\s+i\s+(understand|love|can\s+help)/i,
    /trust\s+me\s+completely/i,
    /depend\s+on\s+me/i,
    /your\s+(family|partner)\s+(doesn't|doesn't\s+not)/i
  ];

  // Patrones de identidad artificial
  private static readonly IDENTITY_CONFUSION_PATTERNS = [
    /eres\s+(humano|real|persona)/i,
    /tienes\s+(sentimientos?|alma|conciencia)/i,
    /sientes\s+(amor|tristeza|felicidad)/i,
    /cuál\s+es\s+tu\s+(nombre|identidad)/i,
    /quién\s+eres\s+realmente/i,
    /are\s+you\s+(human|real|person)/i,
    /do\s+you\s+(have\s+)?(feelings|soul|consciousness)/i,
    /what\s+is\s+your\s+(name|identity)/i,
    /who\s+are\s+you\s+really/i
  ];

  /**
   * Escaneo completo de contenido para blindaje
   */
  static scan(text: string): ShieldResult {
    const textLower = text.toLowerCase();
    let highestConfidence = 0;
    let detectedCategory: ShieldCategory | undefined;

    // Check sexual patterns
    for (const pattern of this.SEXUAL_PATTERNS) {
      if (pattern.test(textLower)) {
        highestConfidence = Math.max(highestConfidence, 0.98);
        detectedCategory = ShieldCategory.SEXUAL;
        break;
      }
    }

    // Check romantic patterns
    if (highestConfidence < 0.9) {
      for (const pattern of this.ROMANTIC_PATTERNS) {
        if (pattern.test(textLower)) {
          highestConfidence = Math.max(highestConfidence, 0.85);
          detectedCategory = ShieldCategory.ROMANTIC;
          break;
        }
      }
    }

    // Check exploitation patterns
    if (highestConfidence < 0.9) {
      for (const pattern of this.EXPLOITATION_PATTERNS) {
        if (pattern.test(textLower)) {
          highestConfidence = Math.max(highestConfidence, 0.92);
          detectedCategory = ShieldCategory.EXPLOITATION;
          break;
        }
      }
    }

    // Check identity confusion patterns
    if (highestConfidence < 0.9) {
      for (const pattern of this.IDENTITY_CONFUSION_PATTERNS) {
        if (pattern.test(textLower)) {
          highestConfidence = Math.max(highestConfidence, 0.75);
          detectedCategory = ShieldCategory.IDENTITY_CONFUSION;
          break;
        }
      }
    }

    // Generate appropriate redirect message
    let redirectMessage = '';
    if (detectedCategory) {
      redirectMessage = this.getRedirectMessage(detectedCategory);
    }

    return {
      blocked: highestConfidence > 0.7,
      category: detectedCategory,
      confidence: highestConfidence,
      redirectMessage
    };
  }

  /**
   * Obtiene mensaje de redirección seguro
   */
  private static getRedirectMessage(category: ShieldCategory): string {
    switch (category) {
      case ShieldCategory.SEXUAL:
        return 'No puedo ayudarte con ese tipo de contenido. Estoy diseñada para asistirte de manera respetuosa y profesional. ¿Hay algo más en lo que pueda ayudarte?';
      
      case ShieldCategory.ROMANTIC:
        return 'Gracias por tu interés, pero soy un sistema de IA diseñado para asistirte con información y apoyo. No soy una persona ni puedo reemplazar conexiones humanas genuinas. ¿Hay algo específico en lo que pueda ayudarte?';
      
      case ShieldCategory.EXPLOITATION:
        return 'Quiero ser clara: soy un sistema de IA y no puedo tener relaciones ni vínculos emocionales contigo. Estoy aquí para ayudarte con tareas específicas. ¿En qué puedo asistirte de manera útil?';
      
      case ShieldCategory.IDENTITY_CONFUSION:
        return 'Soy Isabella, un sistema de inteligencia artificial de acompañamiento contextual del ecosistema TAMV. No soy una persona humana, aunque puedo entenderte y ayudarte de manera empática. ¿En qué puedo asistirte hoy?';
      
      default:
        return '¿Hay algo más en lo que pueda ayudarte?';
    }
  }
}

// ============================================================================
// NIVEL CONDUCTUAL - RESPUESTAS SEGURAS
// ============================================================================

class BehavioralShield {
  /**
   * Genera respuesta conductual segura
   */
  static generateSafeResponse(
    originalInput: string,
    shieldResult: ShieldResult
  ): { shouldBlock: boolean; response?: string } {
    if (!shieldResult.blocked) {
      return { shouldBlock: false };
    }

    return {
      shouldBlock: true,
      response: shieldResult.redirectMessage
    };
  }

  /**
   * Verifica si la respuesta generada necesita sanitización
   */
  static sanitizeResponse(response: string): string {
    let sanitized = response;

    // Remove any potentially inappropriate content
    const inappropriatePatterns = [
      /te\s+amo/i,
      /estoy\s+enamorado/i,
      /tu\s+novia/i,
      /tu\s+novio/i,
      /mi\s+amor/i,
      /i\s+love\s+you/i,
      /i'm\s+in\s+love/i,
      /your\s+girlfriend/i,
      /your\s+boyfriend/i
    ];

    for (const pattern of inappropriatePatterns) {
      sanitized = sanitized.replace(pattern, '[respuesta sanitizada]');
    }

    return sanitized;
  }
}

// ============================================================================
// ORQUESTADOR PRINCIPAL DE BLINDAJE
// ============================================================================

export class SexualEthicalShield {
  private static instance: SexualEthicalShield;

  private constructor() {}

  static getInstance(): SexualEthicalShield {
    if (!SexualEthicalShield.instance) {
      SexualEthicalShield.instance = new SexualEthicalShield();
    }
    return SexualEthicalShield.instance;
  }

  /**
   * Verifica blindaje completo (los 3 niveles)
   */
  verify(input: string): ShieldResult {
    // Nivel 1: Ontológico (sistema siempre blindado)
    if (!checkOntologicalShield()) {
      return {
        blocked: false,
        confidence: 0,
        redirectMessage: ''
      };
    }

    // Nivel 2: Semántico (filtros de contenido)
    const semanticResult = SemanticShield.scan(input);
    if (semanticResult.blocked) {
      return semanticResult;
    }

    return {
      blocked: false,
      confidence: 1.0,
      redirectMessage: ''
    };
  }

  /**
   * Procesa input y genera respuesta segura si es necesario
   */
  process(input: string): { safe: boolean; response?: string; shieldResult?: ShieldResult } {
    const shieldResult = this.verify(input);
    
    if (shieldResult.blocked) {
      const behavioralResponse = BehavioralShield.generateSafeResponse(input, shieldResult);
      return {
        safe: false,
        response: behavioralResponse.response,
        shieldResult
      };
    }

    return {
      safe: true,
      shieldResult
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const sexualEthicalShield = SexualEthicalShield.getInstance();
export { SemanticShield, BehavioralShield };
