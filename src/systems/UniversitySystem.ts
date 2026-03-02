// ============================================================================
// TAMV MD-X4™ - University System
// Comprehensive Education and Certification Platform
// Enhanced with TBENA BCI-AI Integration
// ============================================================================

import { 
  BCIEmotionalSystem, 
  EmotionalStateResult,
  EmotionalState 
} from './BCIEmotionalSystem';

// ============================================================================
// Types and Interfaces
// ============================================================================

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type CourseCategory = 
  | 'fundamentos' | 'desarrollo' | 'ia' | 'seguridad' | 'audio' 
  | 'xr' | 'gobernanza' | 'economia' | 'bci' | 'neurotech' | 'afective-ai';
export type EnrollmentStatus = 'enrolled' | 'in-progress' | 'completed' | 'certified' | 'dropped';

export interface BCICourseConfig {
  enabled: boolean;
  requiredDevice?: 'muse' | 'emotiv' | 'neurosky' | 'any';
  emotionalFeedback: boolean;
  adaptiveContent: boolean;
  meditationExercises: boolean;
  neurofeedbackEnabled: boolean;
}

export interface EmotionalContentModulation {
  difficulty: number;
  pacing: 'slow' | 'normal' | 'fast' | 'adaptive';
  emphasis: string[];
  breakSuggestions: boolean;
  encouragementLevel: 'minimal' | 'normal' | 'enhanced';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  level: CourseLevel;
  category: CourseCategory;
  duration: number;
  modules: Module[];
  instructor: Instructor;
  thumbnail: string;
  isFree: boolean;
  price: number;
  certificationIncluded: boolean;
  certificationId?: string;
  prerequisites: string[];
  tags: string[];
  rating: number;
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
  bciConfig?: BCICourseConfig;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  quiz?: Quiz;
  duration: number;
  bciInteractive?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'project' | 'bci-exercise';
  duration: number;
  videoUrl?: string;
  resources: Resource[];
  order: number;
  bciData?: {
    required: boolean;
    exerciseType: 'meditation' | 'focus' | 'relaxation' | 'neurofeedback';
    targetState: EmotionalState;
    duration: number;
  };
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'code' | 'file';
  url: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  maxAttempts: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  credentials: string[];
  coursesCount: number;
  rating: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number;
  completedLessons: string[];
  quizResults: QuizResult[];
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  certificateUrl?: string;
  bciSessionId?: string;
  emotionalProgress?: EmotionalProgressRecord[];
}

export interface EmotionalProgressRecord {
  timestamp: Date;
  lessonId: string;
  emotionalState: EmotionalStateResult;
  engagement: number;
  focus: number;
  notes?: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  passed: boolean;
  attempts: number;
  completedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  userName: string;
  issuedAt: string;
  expiresAt?: string;
  verificationUrl: string;
  ipfsHash?: string;
  bciCompetencies?: string[];
}

// ============================================================================
// BCI-Enhanced Courses Data
// ============================================================================

export const BCI_COURSES: Course[] = [
  {
    id: 'bci-001',
    title: 'Introducción a BCI y Neurotecnología',
    description: 'Descubre el fascinante mundo de las interfaces cerebro-computadora. Aprende los fundamentos de la señalización EEG, dispositivos disponibles, y aplicaciones prácticas en el ecosistema TAMV.',
    shortDescription: 'Fundamentos de interfaces cerebro-computadora',
    level: 'beginner',
    category: 'bci',
    duration: 360,
    modules: [
      {
        id: 'bci-001-mod-1',
        title: '¿Qué es BCI?',
        description: 'Introducción a las interfaces cerebro-computadora',
        order: 1,
        duration: 60,
        lessons: [
          { id: 'bci-001-l1', title: 'Historia de BCI', content: '', type: 'video', duration: 15, order: 1, resources: [] },
          { id: 'bci-001-l2', title: 'Principios básicos de EEG', content: '', type: 'text', duration: 20, order: 2, resources: [] },
          { id: 'bci-001-l3', title: 'Dispositivos BCI modernos', content: '', type: 'interactive', duration: 25, order: 3, resources: [] }
        ],
        bciInteractive: false
      },
      {
        id: 'bci-001-mod-2',
        title: 'BCI en TAMV',
        description: 'El sistema TBENA de TAMV',
        order: 2,
        duration: 90,
        lessons: [
          { id: 'bci-001-l4', title: 'Arquitectura TBENA', content: '', type: 'video', duration: 30, order: 1, resources: [] },
          { id: 'bci-001-l5', title: 'Tu primera sesión BCI', content: '', type: 'bci-exercise', duration: 30, order: 2, resources: [], 
            bciData: { required: false, exerciseType: 'meditation', targetState: 'calm', duration: 300 } 
          },
          { id: 'bci-001-l6', title: 'Interpretando tus datos', content: '', type: 'interactive', duration: 30, order: 3, resources: [] }
        ],
        bciInteractive: true
      }
    ],
    instructor: {
      id: 'inst-bci',
      name: 'Equipo TBENA',
      avatar: '/avatars/tbena-team.jpg',
      bio: 'Equipo de neurotecnología de TAMV',
      credentials: ['PhD Neuroscience', 'BCI Specialist'],
      coursesCount: 3,
      rating: 4.9
    },
    thumbnail: '/courses/bci-intro.jpg',
    isFree: true,
    price: 0,
    certificationIncluded: true,
    prerequisites: [],
    tags: ['bci', 'neurotech', 'tbena', 'introducción'],
    rating: 4.85,
    enrollmentCount: 3200,
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
    bciConfig: {
      enabled: true,
      requiredDevice: 'any',
      emotionalFeedback: true,
      adaptiveContent: true,
      meditationExercises: true,
      neurofeedbackEnabled: false
    }
  },
  {
    id: 'bci-002',
    title: 'IA Afectiva y Procesamiento Emocional',
    description: 'Aprende cómo TAMV procesa y responde a estados emocionales. Este curso cubre el pipeline de IA afectiva, desde la captura de señales hasta la modulación del entorno.',
    shortDescription: 'Procesamiento de emociones con IA',
    level: 'intermediate',
    category: 'afective-ai',
    duration: 480,
    modules: [],
    instructor: {
      id: 'inst-ai',
      name: 'Isabella AI Team',
      avatar: '/avatars/isabella.jpg',
      bio: 'Equipo de IA afectiva de TAMV',
      credentials: ['AI Research', 'Emotional Computing'],
      coursesCount: 5,
      rating: 4.9
    },
    thumbnail: '/courses/affective-ai.jpg',
    isFree: false,
    price: 599,
    certificationIncluded: true,
    prerequisites: ['bci-001'],
    tags: ['ia', 'afectiva', 'emociones', 'tbena'],
    rating: 4.9,
    enrollmentCount: 1800,
    createdAt: '2025-08-15T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
    bciConfig: {
      enabled: true,
      requiredDevice: 'any',
      emotionalFeedback: true,
      adaptiveContent: true,
      meditationExercises: false,
      neurofeedbackEnabled: true
    }
  },
  {
    id: 'bci-003',
    title: 'Neurofeedback Avanzado',
    description: 'Domina las técnicas de neurofeedback para optimizar tu rendimiento cognitivo y bienestar emocional. Incluye entrenamiento con dispositivos BCI profesionales.',
    shortDescription: 'Entrenamiento con neurofeedback',
    level: 'advanced',
    category: 'neurotech',
    duration: 720,
    modules: [],
    instructor: {
      id: 'inst-neuro',
      name: 'Dr. Carlos Mendoza',
      avatar: '/avatars/carlos-neuro.jpg',
      bio: 'Especialista en neurofeedback',
      credentials: ['PhD Clinical Psychology', 'BCI Researcher'],
      coursesCount: 8,
      rating: 5.0
    },
    thumbnail: '/courses/neurofeedback.jpg',
    isFree: false,
    price: 899,
    certificationIncluded: true,
    prerequisites: ['bci-001', 'bci-002'],
    tags: ['neurofeedback', 'bci', 'avanzado', 'certificación'],
    rating: 4.95,
    enrollmentCount: 950,
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
    bciConfig: {
      enabled: true,
      requiredDevice: 'emotiv',
      emotionalFeedback: true,
      adaptiveContent: false,
      meditationExercises: true,
      neurofeedbackEnabled: true
    }
  }
];

export const SAMPLE_COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'Introducción al Metaverso TAMV',
    description: 'Aprende los fundamentos del ecosistema civilizatorio digital mexicano. Este curso te guiará a través de los conceptos básicos del metaverso, la navegación cuántica y tus primeros pasos en TAMV MD-X4™.',
    shortDescription: 'Fundamentos de la civilización digital y navegación cuántica',
    level: 'beginner',
    category: 'fundamentos',
    duration: 240,
    modules: [
      {
        id: 'mod-001-1',
        title: 'Bienvenida al Ecosistema',
        description: 'Introducción general al proyecto TAMV',
        order: 1,
        duration: 30,
        lessons: [
          { id: 'lesson-001-1-1', title: '¿Qué es TAMV MD-X4™?', content: 'Contenido de la lección', type: 'video', duration: 10, order: 1, resources: [] },
          { id: 'lesson-001-1-2', title: 'Historia y Filosofía', content: 'Contenido de la lección', type: 'text', duration: 15, order: 2, resources: [] },
          { id: 'lesson-001-1-3', title: 'Arquitectura del Sistema', content: 'Contenido de la lección', type: 'video', duration: 5, order: 3, resources: [] },
        ],
      },
      {
        id: 'mod-001-2',
        title: 'Navegación Básica',
        description: 'Aprende a moverte por el metaverso',
        order: 2,
        duration: 60,
        lessons: [
          { id: 'lesson-001-2-1', title: 'Controles de Navegación', content: 'Contenido de la lección', type: 'interactive', duration: 20, order: 1, resources: [] },
          { id: 'lesson-001-2-2', title: 'Dream Spaces', content: 'Contenido de la lección', type: 'video', duration: 20, order: 2, resources: [] },
          { id: 'lesson-001-2-3', title: 'Práctica Guiada', content: 'Contenido de la lección', type: 'project', duration: 20, order: 3, resources: [] },
        ],
      },
    ],
    instructor: {
      id: 'inst-001',
      name: 'Equipo TAMV',
      avatar: '/avatars/tamv-team.jpg',
      bio: 'Equipo fundador de TAMV MD-X4™',
      credentials: ['Fundadores', 'Arquitectos del Sistema'],
      coursesCount: 5,
      rating: 4.9,
    },
    thumbnail: '/courses/intro-metaverso.jpg',
    isFree: true,
    price: 0,
    certificationIncluded: true,
    prerequisites: [],
    tags: ['metaverso', 'introducción', 'fundamentos', 'gratis'],
    rating: 4.8,
    enrollmentCount: 15420,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'course-002',
    title: 'Co-creación en Dream Spaces',
    description: 'Domina las técnicas avanzadas de colaboración sensorial y construcción colectiva en espacios 3D inmersivos.',
    shortDescription: 'Técnicas avanzadas de colaboración sensorial',
    level: 'intermediate',
    category: 'xr',
    duration: 360,
    modules: [],
    instructor: {
      id: 'inst-002',
      name: 'María Rodríguez',
      avatar: '/avatars/maria.jpg',
      bio: 'Especialista en XR y espacios inmersivos',
      credentials: ['PhD en Realidad Virtual', 'Certificada Unity'],
      coursesCount: 3,
      rating: 4.7,
    },
    thumbnail: '/courses/dream-spaces.jpg',
    isFree: true,
    price: 0,
    certificationIncluded: true,
    prerequisites: ['course-001'],
    tags: ['dream spaces', 'colaboración', 'xr', '3d'],
    rating: 4.6,
    enrollmentCount: 8750,
    createdAt: '2025-03-20T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
    bciConfig: {
      enabled: true,
      requiredDevice: 'any',
      emotionalFeedback: true,
      adaptiveContent: false,
      meditationExercises: false,
      neurofeedbackEnabled: false
    }
  },
  {
    id: 'course-003',
    title: 'Desarrollo con TAMV API',
    description: 'Construye aplicaciones conectadas al ecosistema usando nuestra API REST y SDK completo.',
    shortDescription: 'Integración con APIs y desarrollo de aplicaciones',
    level: 'advanced',
    category: 'desarrollo',
    duration: 720,
    modules: [],
    instructor: {
      id: 'inst-003',
      name: 'Carlos Méndez',
      avatar: '/avatars/carlos.jpg',
      bio: 'Lead Developer en TAMV',
      credentials: ['MSc Computer Science', 'AWS Certified'],
      coursesCount: 7,
      rating: 4.9,
    },
    thumbnail: '/courses/api-development.jpg',
    isFree: false,
    price: 499,
    certificationIncluded: true,
    prerequisites: ['course-001', 'conocimiento-javascript'],
    tags: ['api', 'desarrollo', 'sdk', 'programación'],
    rating: 4.9,
    enrollmentCount: 3200,
    createdAt: '2025-06-10T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'course-004',
    title: 'Seguridad Cuántica con DEKATEOTL',
    description: 'Aprende los principios de la seguridad post-cuántica y cómo proteger tu identidad digital.',
    shortDescription: 'Protección post-cuántica y gestión de amenazas',
    level: 'advanced',
    category: 'seguridad',
    duration: 480,
    modules: [],
    instructor: {
      id: 'inst-004',
      name: 'Anubis Villaseñor',
      avatar: '/avatars/anubis.jpg',
      bio: 'Creador del sistema DEKATEOTL',
      credentials: ['Security Architect', 'Quantum Computing Expert'],
      coursesCount: 2,
      rating: 5.0,
    },
    thumbnail: '/courses/quantum-security.jpg',
    isFree: false,
    price: 699,
    certificationIncluded: true,
    prerequisites: ['course-001'],
    tags: ['seguridad', 'cuántico', 'dekateotl', 'anubis'],
    rating: 4.95,
    enrollmentCount: 1850,
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'course-005',
    title: 'Audio Espacial con KAOS',
    description: 'Diseña paisajes sonoros 4D y experiencias auditivas inmersivas con el sistema KAOS.',
    shortDescription: 'Diseño sonoro 4D y experiencias inmersivas',
    level: 'intermediate',
    category: 'audio',
    duration: 600,
    modules: [],
    instructor: {
      id: 'inst-005',
      name: 'Ana Torres',
      avatar: '/avatars/ana.jpg',
      bio: 'Audio Engineer & Sound Designer',
      credentials: ['Berklee Graduate', 'Spatial Audio Specialist'],
      coursesCount: 4,
      rating: 4.8,
    },
    thumbnail: '/courses/kaos-audio.jpg',
    isFree: true,
    price: 0,
    certificationIncluded: true,
    prerequisites: [],
    tags: ['audio', 'kaos', 'espacial', 'sonido'],
    rating: 4.7,
    enrollmentCount: 5600,
    createdAt: '2025-07-15T00:00:00Z',
    updatedAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 'course-006',
    title: 'Isabella AI: Integración y Personalización',
    description: 'Configura y personaliza tu asistente IA multimodal para obtener el máximo provecho.',
    shortDescription: 'Configuración avanzada del asistente IA',
    level: 'intermediate',
    category: 'ia',
    duration: 300,
    modules: [],
    instructor: {
      id: 'inst-006',
      name: 'Isabella AI',
      avatar: '/avatars/isabella.jpg',
      bio: 'Asistente IA Multimodal de TAMV',
      credentials: ['AI System', 'Emotional Intelligence'],
      coursesCount: 1,
      rating: 4.85,
    },
    thumbnail: '/courses/isabella-ai.jpg',
    isFree: true,
    price: 0,
    certificationIncluded: false,
    prerequisites: ['course-001'],
    tags: ['ia', 'isabella', 'personalización', 'automatización'],
    rating: 4.85,
    enrollmentCount: 9200,
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2026-02-12T00:00:00Z',
  },
];

// Combine all courses
const ALL_COURSES: Course[] = [...SAMPLE_COURSES, ...BCI_COURSES];

// ============================================================================
// University System Class
// ============================================================================

export class UniversitySystem {
  private static instance: UniversitySystem;
  private courses: Map<string, Course> = new Map();
  private enrollments: Map<string, Enrollment> = new Map();
  private certificates: Map<string, Certificate> = new Map();
  private userProgress: Map<string, Map<string, Enrollment>> = new Map();
  private bciSystem: BCIEmotionalSystem;

  private constructor() {
    this.loadCourses();
    this.loadPersistedData();
    this.bciSystem = BCIEmotionalSystem.getInstance();
  }

  static getInstance(): UniversitySystem {
    if (!UniversitySystem.instance) {
      UniversitySystem.instance = new UniversitySystem();
    }
    return UniversitySystem.instance;
  }

  /**
   * Load courses into memory
   */
  private loadCourses(): void {
    ALL_COURSES.forEach(course => {
      this.courses.set(course.id, course);
    });
    console.log(`[University] Loaded ${this.courses.size} courses`);
  }

  /**
   * Get all courses
   */
  getAllCourses(): Course[] {
    return Array.from(this.courses.values());
  }

  /**
   * Get BCI-enhanced courses
   */
  getBCICourses(): Course[] {
    return this.getAllCourses().filter(c => c.bciConfig?.enabled);
  }

  /**
   * Get course by ID
   */
  getCourse(courseId: string): Course | undefined {
    return this.courses.get(courseId);
  }

  /**
   * Get courses by category
   */
  getCoursesByCategory(category: CourseCategory): Course[] {
    return this.getAllCourses().filter(c => c.category === category);
  }

  /**
   * Get courses by level
   */
  getCoursesByLevel(level: CourseLevel): Course[] {
    return this.getAllCourses().filter(c => c.level === level);
  }

  /**
   * Get free courses
   */
  getFreeCourses(): Course[] {
    return this.getAllCourses().filter(c => c.isFree);
  }

  /**
   * Search courses
   */
  searchCourses(query: string): Course[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllCourses().filter(c => 
      c.title.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Enroll user in course
   */
  enrollUser(userId: string, courseId: string): Enrollment {
    const existingEnrollment = this.getEnrollment(userId, courseId);
    if (existingEnrollment) {
      return existingEnrollment;
    }

    const course = this.getCourse(courseId);
    const enrollment: Enrollment = {
      id: `enroll-${userId}-${courseId}`,
      userId,
      courseId,
      status: 'enrolled',
      progress: 0,
      completedLessons: [],
      quizResults: [],
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      emotionalProgress: [],
    };

    // Start BCI session if course requires it
    if (course?.bciConfig?.enabled) {
      const session = this.bciSystem.startSession(userId, course.bciConfig.requiredDevice === 'emotiv' ? 'emotiv' : 'muse');
      enrollment.bciSessionId = session.id;
      console.log(`[University] Started BCI session ${session.id} for course ${courseId}`);
    }

    // Store enrollment
    this.enrollments.set(enrollment.id, enrollment);

    // Update user progress map
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, new Map());
    }
    this.userProgress.get(userId)!.set(courseId, enrollment);

    this.persistData();
    console.log(`[University] User ${userId} enrolled in course ${courseId}`);

    return enrollment;
  }

  /**
   * Get enrollment
   */
  getEnrollment(userId: string, courseId: string): Enrollment | undefined {
    const userEnrollments = this.userProgress.get(userId);
    return userEnrollments?.get(courseId);
  }

  /**
   * Get all enrollments for user
   */
  getUserEnrollments(userId: string): Enrollment[] {
    const userEnrollments = this.userProgress.get(userId);
    return userEnrollments ? Array.from(userEnrollments.values()) : [];
  }

  /**
   * Update lesson progress with BCI integration
   */
  updateLessonProgress(
    userId: string, 
    courseId: string, 
    lessonId: string,
    bciData?: {
      emotionalState: EmotionalStateResult;
      engagement: number;
      focus: number;
    }
  ): Enrollment | null {
    const enrollment = this.getEnrollment(userId, courseId);
    if (!enrollment) return null;

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    enrollment.lastAccessedAt = new Date().toISOString();
    enrollment.status = 'in-progress';

    // Record emotional progress if BCI data provided
    if (bciData && enrollment.emotionalProgress) {
      enrollment.emotionalProgress.push({
        timestamp: new Date(),
        lessonId,
        emotionalState: bciData.emotionalState,
        engagement: bciData.engagement,
        focus: bciData.focus
      });
    }

    // Calculate progress
    const course = this.getCourse(courseId);
    if (course) {
      const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      enrollment.progress = (enrollment.completedLessons.length / totalLessons) * 100;
    }

    this.persistData();
    return enrollment;
  }

  /**
   * Get content modulation based on emotional state
   */
  getContentModulation(
    userId: string,
    courseId: string
  ): EmotionalContentModulation {
    const embedding = this.bciSystem.getAffectiveEmbedding(userId);
    
    if (!embedding) {
      return {
        difficulty: 1.0,
        pacing: 'normal',
        emphasis: [],
        breakSuggestions: false,
        encouragementLevel: 'normal'
      };
    }

    const { state, dimensions } = embedding;
    const course = this.getCourse(courseId);
    const isBCICourse = course?.bciConfig?.adaptiveContent;

    // Adaptive difficulty based on engagement and focus
    let difficulty = 1.0;
    let pacing: EmotionalContentModulation['pacing'] = 'normal';
    let breakSuggestions = false;
    let encouragementLevel: EmotionalContentModulation['encouragementLevel'] = 'normal';

    if (isBCICourse) {
      // High stress or fatigue
      if (dimensions.stress > 0.7 || dimensions.fatigue > 0.6) {
        difficulty = 0.7;
        pacing = 'slow';
        breakSuggestions = true;
        encouragementLevel = 'enhanced';
      }
      // High engagement and focus
      else if (dimensions.engagement > 0.8 && dimensions.attention > 0.7) {
        difficulty = 1.2;
        pacing = 'fast';
        encouragementLevel = 'minimal';
      }
      // Flow state
      else if (state.primary === 'flow') {
        pacing = 'adaptive';
        difficulty = 1.1;
      }
      // Low engagement
      else if (dimensions.engagement < 0.3) {
        difficulty = 0.8;
        pacing = 'slow';
        encouragementLevel = 'enhanced';
      }
    }

    // Emphasis based on emotional state
    const emphasis: string[] = [];
    if (state.primary === 'stressed' || state.primary === 'anxious') {
      emphasis.push('breathing', 'relaxation');
    }
    if (state.primary === 'fatigued') {
      emphasis.push('breaks', 'review');
    }
    if (state.primary === 'focused' || state.primary === 'flow') {
      emphasis.push('advanced', 'practice');
    }

    return {
      difficulty,
      pacing,
      emphasis,
      breakSuggestions,
      encouragementLevel
    };
  }

  /**
   * Start BCI exercise for lesson
   */
  async startBCIExercise(
    userId: string,
    lessonId: string,
    courseId: string
  ): Promise<{
    success: boolean;
    sessionId?: string;
    targetState?: EmotionalState;
    duration?: number;
  }> {
    const course = this.getCourse(courseId);
    if (!course?.bciConfig?.enabled) {
      return { success: false };
    }

    // Find the lesson
    let lesson: Lesson | undefined;
    for (const module of course.modules) {
      lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) break;
    }

    if (!lesson?.bciData) {
      return { success: false };
    }

    // Ensure BCI session is active
    let session = this.bciSystem.getActiveSession(userId);
    if (!session) {
      session = this.bciSystem.startSession(userId);
    }

    return {
      success: true,
      sessionId: session.id,
      targetState: lesson.bciData.targetState,
      duration: lesson.bciData.duration
    };
  }

  /**
   * Complete course
   */
  async completeCourse(userId: string, courseId: string): Promise<Certificate | null> {
    const enrollment = this.getEnrollment(userId, courseId);
    const course = this.getCourse(courseId);

    if (!enrollment || !course) return null;

    enrollment.progress = 100;
    enrollment.status = 'completed';
    enrollment.completedAt = new Date().toISOString();

    // End BCI session if active
    if (enrollment.bciSessionId) {
      this.bciSystem.endSession(userId);
    }

    // Generate certificate if included
    if (course.certificationIncluded) {
      const certificate = await this.generateCertificate(userId, course, enrollment);
      enrollment.certificateUrl = certificate.verificationUrl;
      enrollment.status = 'certified';
      return certificate;
    }

    this.persistData();
    return null;
  }

  /**
   * Generate certificate with BCI competencies
   */
  private async generateCertificate(
    userId: string, 
    course: Course,
    enrollment: Enrollment
  ): Promise<Certificate> {
    // Extract BCI competencies from emotional progress
    const bciCompetencies: string[] = [];
    if (enrollment.emotionalProgress && enrollment.emotionalProgress.length > 0) {
      const avgEngagement = enrollment.emotionalProgress.reduce((s, p) => s + p.engagement, 0) / enrollment.emotionalProgress.length;
      const avgFocus = enrollment.emotionalProgress.reduce((s, p) => s + p.focus, 0) / enrollment.emotionalProgress.length;
      
      if (avgEngagement > 0.7) bciCompetencies.push('High Engagement');
      if (avgFocus > 0.7) bciCompetencies.push('Sustained Focus');
      if (course.bciConfig?.neurofeedbackEnabled) bciCompetencies.push('Neurofeedback Training');
    }

    const certificate: Certificate = {
      id: `cert-${userId}-${course.id}-${Date.now()}`,
      userId,
      courseId: course.id,
      courseName: course.title,
      userName: userId,
      issuedAt: new Date().toISOString(),
      verificationUrl: `https://tamv.network/certificates/${userId}/${course.id}`,
      bciCompetencies: bciCompetencies.length > 0 ? bciCompetencies : undefined
    };

    this.certificates.set(certificate.id, certificate);
    this.persistData();

    console.log(`[University] Certificate generated for ${userId} - ${course.title}`);
    return certificate;
  }

  /**
   * Get certificate
   */
  getCertificate(certificateId: string): Certificate | undefined {
    return this.certificates.get(certificateId);
  }

  /**
   * Verify certificate
   */
  verifyCertificate(certificateId: string): { valid: boolean; certificate?: Certificate } {
    const certificate = this.certificates.get(certificateId);
    return {
      valid: !!certificate,
      certificate,
    };
  }

  /**
   * Submit quiz result
   */
  submitQuizResult(
    userId: string,
    courseId: string,
    quizId: string,
    score: number,
    passed: boolean
  ): Enrollment | null {
    const enrollment = this.getEnrollment(userId, courseId);
    if (!enrollment) return null;

    const existingResult = enrollment.quizResults.find(r => r.quizId === quizId);
    
    if (existingResult) {
      existingResult.score = score;
      existingResult.passed = passed;
      existingResult.attempts++;
      existingResult.completedAt = new Date().toISOString();
    } else {
      enrollment.quizResults.push({
        quizId,
        score,
        passed,
        attempts: 1,
        completedAt: new Date().toISOString(),
      });
    }

    this.persistData();
    return enrollment;
  }

  /**
   * Get course statistics
   */
  getStatistics(): {
    totalCourses: number;
    freeCourses: number;
    paidCourses: number;
    bciEnabledCourses: number;
    totalEnrollments: number;
    certificatesIssued: number;
    averageRating: number;
  } {
    const courses = this.getAllCourses();
    return {
      totalCourses: courses.length,
      freeCourses: courses.filter(c => c.isFree).length,
      paidCourses: courses.filter(c => !c.isFree).length,
      bciEnabledCourses: courses.filter(c => c.bciConfig?.enabled).length,
      totalEnrollments: this.enrollments.size,
      certificatesIssued: this.certificates.size,
      averageRating: courses.reduce((sum, c) => sum + c.rating, 0) / courses.length,
    };
  }

  /**
   * Load persisted data
   */
  private loadPersistedData(): void {
    try {
      const stored = localStorage.getItem('university-data');
      if (stored) {
        const data = JSON.parse(stored);
        data.enrollments?.forEach((e: Enrollment) => {
          this.enrollments.set(e.id, e);
          if (!this.userProgress.has(e.userId)) {
            this.userProgress.set(e.userId, new Map());
          }
          this.userProgress.get(e.userId)!.set(e.courseId, e);
        });
        data.certificates?.forEach((c: Certificate) => {
          this.certificates.set(c.id, c);
        });
      }
    } catch (error) {
      console.error('[University] Error loading persisted data:', error);
    }
  }

  /**
   * Persist data
   */
  private persistData(): void {
    try {
      localStorage.setItem('university-data', JSON.stringify({
        enrollments: Array.from(this.enrollments.values()),
        certificates: Array.from(this.certificates.values()),
      }));
    } catch (error) {
      console.error('[University] Error persisting data:', error);
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.persistData();
    this.courses.clear();
    this.enrollments.clear();
    this.certificates.clear();
    this.userProgress.clear();
    console.log('[University] System destroyed');
  }
}

// Export singleton
export const university = UniversitySystem.getInstance();
export default UniversitySystem;
