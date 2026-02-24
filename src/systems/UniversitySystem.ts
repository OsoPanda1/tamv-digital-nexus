// ============================================================================
// TAMV MD-X4™ - University System
// Comprehensive Education and Certification Platform
// ============================================================================

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type CourseCategory = 'fundamentos' | 'desarrollo' | 'ia' | 'seguridad' | 'audio' | 'xr' | 'gobernanza' | 'economia';
export type EnrollmentStatus = 'enrolled' | 'in-progress' | 'completed' | 'certified' | 'dropped';

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  level: CourseLevel;
  category: CourseCategory;
  duration: number; // in minutes
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
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  quiz?: Quiz;
  duration: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'project';
  duration: number;
  videoUrl?: string;
  resources: Resource[];
  order: number;
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
}

// ============================================================================
// Sample Courses Data
// ============================================================================

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
          { id: 'lesson-001-1-1', title: 'Â¿Qué es TAMV MD-X4™?', content: 'Contenido de la lección', type: 'video', duration: 10, order: 1, resources: [] },
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

// ============================================================================
// University System Class
// ============================================================================

export class UniversitySystem {
  private static instance: UniversitySystem;
  private courses: Map<string, Course> = new Map();
  private enrollments: Map<string, Enrollment> = new Map();
  private certificates: Map<string, Certificate> = new Map();
  private userProgress: Map<string, Map<string, Enrollment>> = new Map();

  private constructor() {
    this.loadCourses();
    this.loadPersistedData();
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
    SAMPLE_COURSES.forEach(course => {
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
    };

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
   * Update lesson progress
   */
  updateLessonProgress(userId: string, courseId: string, lessonId: string): Enrollment | null {
    const enrollment = this.getEnrollment(userId, courseId);
    if (!enrollment) return null;

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    enrollment.lastAccessedAt = new Date().toISOString();
    enrollment.status = 'in-progress';

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
   * Complete course
   */
  async completeCourse(userId: string, courseId: string): Promise<Certificate | null> {
    const enrollment = this.getEnrollment(userId, courseId);
    const course = this.getCourse(courseId);

    if (!enrollment || !course) return null;

    enrollment.progress = 100;
    enrollment.status = 'completed';
    enrollment.completedAt = new Date().toISOString();

    // Generate certificate if included
    if (course.certificationIncluded) {
      const certificate = await this.generateCertificate(userId, course);
      enrollment.certificateUrl = certificate.verificationUrl;
      enrollment.status = 'certified';
      return certificate;
    }

    this.persistData();
    return null;
  }

  /**
   * Generate certificate
   */
  private async generateCertificate(userId: string, course: Course): Promise<Certificate> {
    const certificate: Certificate = {
      id: `cert-${userId}-${course.id}-${Date.now()}`,
      userId,
      courseId: course.id,
      courseName: course.title,
      userName: userId, // Should be replaced with actual user name
      issuedAt: new Date().toISOString(),
      verificationUrl: `https://tamv.network/certificates/${userId}/${course.id}`,
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
    totalEnrollments: number;
    certificatesIssued: number;
    averageRating: number;
  } {
    const courses = this.getAllCourses();
    return {
      totalCourses: courses.length,
      freeCourses: courses.filter(c => c.isFree).length,
      paidCourses: courses.filter(c => !c.isFree).length,
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