import Navigation from '@/components/Navigation';
import { HolographicPanel, HolographicButton, QuantumBadge } from '@/components/HolographicUI';
import { BookOpen, Award, Users, Video, FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: number;
  category: string;
  isFree: boolean;
  certification: boolean;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Introducción al Metaverso TAMV',
    description: 'Fundamentos de la civilización digital, navegación cuántica y primeros pasos',
    level: 'beginner',
    duration: '4 horas',
    modules: 8,
    category: 'Fundamentos',
    isFree: true,
    certification: true
  },
  {
    id: '2',
    title: 'Co-creación en Dream Spaces',
    description: 'Técnicas avanzadas de colaboración sensorial y construcción colectiva',
    level: 'intermediate',
    duration: '6 horas',
    modules: 12,
    category: 'Colaboración',
    isFree: true,
    certification: true
  },
  {
    id: '3',
    title: 'Desarrollo con TAMV API',
    description: 'Construye aplicaciones conectadas al ecosistema usando nuestra API',
    level: 'advanced',
    duration: '12 horas',
    modules: 20,
    category: 'Desarrollo',
    isFree: false,
    certification: true
  },
  {
    id: '4',
    title: 'Seguridad Cuántica con DEKATEOTL',
    description: 'Protección post-cuántica, identidad digital y gestión de amenazas',
    level: 'advanced',
    duration: '8 horas',
    modules: 16,
    category: 'Seguridad',
    isFree: false,
    certification: true
  },
  {
    id: '5',
    title: 'Audio Espacial con KAOS',
    description: 'Diseño sonoro 4D, paisajes acústicos y experiencias inmersivas',
    level: 'intermediate',
    duration: '10 horas',
    modules: 15,
    category: 'Audio',
    isFree: true,
    certification: true
  },
  {
    id: '6',
    title: 'Isabella AI: Integración y Personalización',
    description: 'Configura y personaliza tu asistente IA multimodal',
    level: 'intermediate',
    duration: '5 horas',
    modules: 10,
    category: 'IA',
    isFree: true,
    certification: false
  }
];

export default function University() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');

  const filteredCourses = courses.filter(course => {
    if (filter === 'free') return course.isFree;
    if (filter === 'paid') return !course.isFree;
    return true;
  });

  const levelColors = {
    beginner: 'primary',
    intermediate: 'secondary',
    advanced: 'accent'
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Universidad TAMV
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Formación gratuita y certificada en tecnologías cuánticas, metaverso y desarrollo avanzado
          </p>

          <div className="flex justify-center gap-4">
            <HolographicButton
              variant={filter === 'all' ? 'primary' : 'ghost'}
              onClick={() => setFilter('all')}
            >
              Todos los cursos
            </HolographicButton>
            <HolographicButton
              variant={filter === 'free' ? 'primary' : 'ghost'}
              onClick={() => setFilter('free')}
            >
              Gratuitos
            </HolographicButton>
            <HolographicButton
              variant={filter === 'paid' ? 'primary' : 'ghost'}
              onClick={() => setFilter('paid')}
            >
              Pro
            </HolographicButton>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCourses.map((course) => (
            <HolographicPanel key={course.id} className="p-6 hover:scale-105 transition-transform">
              <div className="flex items-start justify-between mb-4">
                <QuantumBadge color={levelColors[course.level]}>
                  {course.level}
                </QuantumBadge>
                {course.isFree && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    Gratis
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span>{course.duration} · {course.modules} módulos</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{course.category}</span>
                </div>
                {course.certification && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" />
                    <span>Certificación incluida</span>
                  </div>
                )}
              </div>

              <HolographicButton
                variant="primary"
                onClick={() => setSelectedCourse(course)}
                className="w-full"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Ver curso
              </HolographicButton>
            </HolographicPanel>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <HolographicPanel className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Certificación Reconocida</h3>
            <p className="text-sm text-muted-foreground">
              Certificados oficiales del ecosistema TAMV con validez internacional
            </p>
          </HolographicPanel>

          <HolographicPanel className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Comunidad Activa</h3>
            <p className="text-sm text-muted-foreground">
              Conecta con estudiantes y profesionales de todo el mundo
            </p>
          </HolographicPanel>

          <HolographicPanel className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Aprendizaje Inmersivo</h3>
            <p className="text-sm text-muted-foreground">
              Experiencias prácticas en Dream Spaces con IA y realidad extendida
            </p>
          </HolographicPanel>
        </div>
      </div>
    </div>
  );
}
