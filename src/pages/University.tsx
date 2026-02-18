import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, Award, Users, Video, FileText, Sparkles, 
  GraduationCap, Play, CheckCircle, Clock, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: number;
  category: string;
  isFree: boolean;
  certification: boolean;
  image?: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'practice';
  completed?: boolean;
}

interface Enrollment {
  courseId: string;
  progress: number;
  completed: boolean;
  completedLessons: string[];
}

const coursesData: Course[] = [
  {
    id: '1', title: 'Introducción al Metaverso TAMV',
    description: 'Fundamentos de la civilización digital, navegación cuántica y primeros pasos en el ecosistema TAMV MD-X4™',
    level: 'beginner', duration: '4 horas', modules: 8, category: 'Fundamentos', isFree: true, certification: true,
    lessons: [
      { id: '1-1', title: '¿Qué es TAMV MD-X4™?', duration: '15 min', type: 'video' },
      { id: '1-2', title: 'Navegación del Dashboard', duration: '20 min', type: 'video' },
      { id: '1-3', title: 'Tu ID-NVIDA™ Soberana', duration: '25 min', type: 'video' },
      { id: '1-4', title: 'Wallet TCEP y Economía MSR', duration: '30 min', type: 'video' },
      { id: '1-5', title: 'Isabella AI: Tu Mentora Digital', duration: '20 min', type: 'practice' },
      { id: '1-6', title: 'Dream Spaces y Metaverso', duration: '25 min', type: 'video' },
      { id: '1-7', title: 'Gobernanza CITEMESH DAO', duration: '15 min', type: 'text' },
      { id: '1-8', title: 'Evaluación Final', duration: '30 min', type: 'quiz' },
    ]
  },
  {
    id: '2', title: 'Co-creación en Dream Spaces',
    description: 'Técnicas avanzadas de colaboración sensorial, construcción colectiva 3D/4D y experiencias inmersivas XR',
    level: 'intermediate', duration: '6 horas', modules: 12, category: 'Colaboración', isFree: true, certification: true,
    lessons: [
      { id: '2-1', title: 'Fundamentos de DreamSpaces', duration: '20 min', type: 'video' },
      { id: '2-2', title: 'Diseño de Espacios 3D', duration: '30 min', type: 'video' },
      { id: '2-3', title: 'Audio Espacial Binaural', duration: '25 min', type: 'practice' },
      { id: '2-4', title: 'Colaboración Multi-usuario', duration: '30 min', type: 'video' },
      { id: '2-5', title: 'Evaluación Intermedia', duration: '20 min', type: 'quiz' },
    ]
  },
  {
    id: '3', title: 'Desarrollo con TAMV API DM-X7™',
    description: 'Construye aplicaciones conectadas al ecosistema usando la API Unificada Omni-Modus',
    level: 'advanced', duration: '12 horas', modules: 20, category: 'Desarrollo', isFree: false, certification: true,
    lessons: [
      { id: '3-1', title: 'Arquitectura DM-X7™ Overview', duration: '30 min', type: 'video' },
      { id: '3-2', title: 'Autenticación y ID-NVIDA', duration: '45 min', type: 'video' },
      { id: '3-3', title: 'TCEP Economy Endpoints', duration: '40 min', type: 'practice' },
      { id: '3-4', title: 'DAO & Governance API', duration: '35 min', type: 'video' },
      { id: '3-5', title: 'MSR Immutable Ledger', duration: '30 min', type: 'video' },
      { id: '3-6', title: 'Proyecto Final: dApp TAMV', duration: '60 min', type: 'practice' },
    ]
  },
  {
    id: '4', title: 'Seguridad Cuántica con DEKATEOTL',
    description: 'Protección post-cuántica Kyber-1024, identidad digital soberana y gestión de amenazas con Anubis Sentinel',
    level: 'advanced', duration: '8 horas', modules: 16, category: 'Seguridad', isFree: false, certification: true,
    lessons: [
      { id: '4-1', title: 'Criptografía Post-Cuántica', duration: '30 min', type: 'video' },
      { id: '4-2', title: 'Anubis Sentinel Architecture', duration: '40 min', type: 'video' },
      { id: '4-3', title: 'Zero Trust en TAMV', duration: '25 min', type: 'text' },
      { id: '4-4', title: 'Práctica: Audit Trail BookPI', duration: '35 min', type: 'practice' },
    ]
  },
  {
    id: '5', title: 'Audio Espacial con KAOS',
    description: 'Diseño sonoro 4D, paisajes acústicos binaurales y experiencias de audio inmersivo HRTF',
    level: 'intermediate', duration: '10 horas', modules: 15, category: 'Audio', isFree: true, certification: true,
    lessons: [
      { id: '5-1', title: 'Fundamentos Audio Binaural', duration: '25 min', type: 'video' },
      { id: '5-2', title: 'HRTF Panning & Spatialization', duration: '30 min', type: 'video' },
      { id: '5-3', title: 'Paisajes Sonoros Inmersivos', duration: '35 min', type: 'practice' },
    ]
  },
  {
    id: '6', title: 'Isabella AI: Integración y Personalización',
    description: 'Configura tu asistente IA multimodal, trazabilidad emocional EOCT™ y mentoring personalizado',
    level: 'intermediate', duration: '5 horas', modules: 10, category: 'IA', isFree: true, certification: false,
    lessons: [
      { id: '6-1', title: 'Isabella Prime Architecture', duration: '20 min', type: 'video' },
      { id: '6-2', title: 'Emotional Analysis EOCT™', duration: '25 min', type: 'video' },
      { id: '6-3', title: 'Práctica: Tu Isabella Personal', duration: '30 min', type: 'practice' },
    ]
  }
];

const levelColors: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-300',
  intermediate: 'bg-blue-500/20 text-blue-300',
  advanced: 'bg-purple-500/20 text-purple-300',
};

const levelLabels: Record<string, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

export default function University() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>({});
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const filteredCourses = coursesData.filter(course => {
    if (filter === 'free') return course.isFree;
    if (filter === 'paid') return !course.isFree;
    return true;
  });

  const enrollInCourse = async (courseId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error('Inicia sesión para inscribirte');

    setEnrollments(prev => ({
      ...prev,
      [courseId]: { courseId, progress: 0, completed: false, completedLessons: [] }
    }));

    // Save to DB
    await (supabase as any).from('course_enrollments').insert({
      course_id: courseId, user_id: user.id, progress: 0
    });

    toast.success('¡Inscripción exitosa! Bienvenido al curso.');
  };

  const completeLesson = async (courseId: string, lessonId: string) => {
    const enrollment = enrollments[courseId];
    if (!enrollment) return;

    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;

    const newCompleted = [...enrollment.completedLessons, lessonId];
    const progress = Math.round((newCompleted.length / course.lessons.length) * 100);
    const completed = progress >= 100;

    setEnrollments(prev => ({
      ...prev,
      [courseId]: { ...enrollment, completedLessons: newCompleted, progress, completed }
    }));

    if (completed) {
      toast.success('🎓 ¡Curso completado! Tu certificación ha sido registrada en BookPI.');
      // Log to BookPI
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await (supabase as any).rpc('create_bookpi_event', {
          p_event_type: 'certification_earned',
          p_actor_id: user.id,
          p_resource_type: 'course',
          p_resource_id: courseId,
          p_payload: { course_title: course.title, completed_at: new Date().toISOString() }
        });
      }
    } else {
      toast.success('✅ Lección completada');
    }
  };

  if (selectedCourse) {
    const enrollment = enrollments[selectedCourse.id];
    return (
      <div className="min-h-screen bg-background">
        <QuantumCanvas />
        <Navigation />
        <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Button variant="ghost" onClick={() => { setSelectedCourse(null); setActiveLesson(null); }} className="mb-6">
              ← Volver a cursos
            </Button>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="glass-panel p-8 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className={levelColors[selectedCourse.level]}>{levelLabels[selectedCourse.level]}</Badge>
                      {selectedCourse.isFree && <Badge className="bg-green-500/20 text-green-300">Gratis</Badge>}
                    </div>
                    <h1 className="text-3xl font-bold mb-3">{selectedCourse.title}</h1>
                    <p className="text-muted-foreground mb-6">{selectedCourse.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedCourse.duration}</span>
                      <span className="flex items-center gap-1"><Video className="w-4 h-4" /> {selectedCourse.modules} módulos</span>
                      <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {selectedCourse.category}</span>
                      {selectedCourse.certification && <span className="flex items-center gap-1"><Award className="w-4 h-4 text-accent" /> Certificación</span>}
                    </div>
                  </Card>

                  {/* Active Lesson Content */}
                  {activeLesson && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Card className="glass-panel p-8 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold">{activeLesson.title}</h2>
                          <Badge variant="outline">{activeLesson.type === 'video' ? '🎥 Video' : activeLesson.type === 'quiz' ? '📝 Quiz' : activeLesson.type === 'practice' ? '🛠️ Práctica' : '📖 Lectura'}</Badge>
                        </div>
                        
                        {/* Simulated content area */}
                        <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 via-background to-secondary/20 border border-border/30 flex items-center justify-center mb-6">
                          <div className="text-center">
                            <Play className="w-16 h-16 text-primary mx-auto mb-4 opacity-60" />
                            <p className="text-muted-foreground">Contenido de la lección</p>
                            <p className="text-sm text-muted-foreground mt-1">{activeLesson.duration}</p>
                          </div>
                        </div>

                        {enrollment && !enrollment.completedLessons.includes(activeLesson.id) && (
                          <Button
                            className="w-full bg-quantum-gradient shadow-quantum"
                            onClick={() => completeLesson(selectedCourse.id, activeLesson.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Marcar como completada
                          </Button>
                        )}
                        {enrollment?.completedLessons.includes(activeLesson.id) && (
                          <div className="text-center text-green-400 font-bold flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Lección completada
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Sidebar - Lessons list */}
              <div>
                <Card className="glass-panel p-6 sticky top-32">
                  {enrollment ? (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progreso</span>
                        <span className="font-bold text-primary">{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-3" />
                      {enrollment.completed && (
                        <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                          <Award className="w-6 h-6 text-accent mx-auto mb-1" />
                          <p className="text-sm font-bold text-green-300">¡Certificado obtenido!</p>
                          <p className="text-xs text-muted-foreground">Registrado en BookPI™</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button className="w-full mb-6 bg-quantum-gradient shadow-quantum" onClick={() => enrollInCourse(selectedCourse.id)}>
                      <GraduationCap className="w-4 h-4 mr-2" /> Inscribirse
                    </Button>
                  )}

                  <h3 className="font-bold mb-4">Lecciones ({selectedCourse.lessons.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedCourse.lessons.map((lesson, i) => {
                      const isCompleted = enrollment?.completedLessons.includes(lesson.id);
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => enrollment && setActiveLesson(lesson)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                            isActive ? 'bg-primary/20 border border-primary/30' :
                            isCompleted ? 'bg-green-500/10 border border-green-500/20' :
                            'bg-card/50 border border-border/20 hover:bg-card/80'
                          } ${!enrollment ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          disabled={!enrollment}
                        >
                          <span className="text-xs font-mono text-muted-foreground w-6">{String(i + 1).padStart(2, '0')}</span>
                          {isCompleted ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> : <Play className="w-4 h-4 text-muted-foreground shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <QuantumCanvas />
      <Navigation />
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                🎓 Universidad TAMV
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Formación gratuita y certificada en tecnologías cuánticas, metaverso y desarrollo avanzado. Certificaciones verificables en BookPI™.
            </p>

            <div className="flex justify-center gap-3">
              {(['all', 'free', 'paid'] as const).map(f => (
                <Button key={f} variant={filter === f ? 'default' : 'outline'} onClick={() => setFilter(f)}
                  className={filter === f ? 'bg-quantum-gradient shadow-quantum' : ''}>
                  {f === 'all' ? 'Todos' : f === 'free' ? '🆓 Gratuitos' : '⭐ Pro'}
                </Button>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredCourses.map((course, i) => {
              const enrollment = enrollments[course.id];
              return (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="glass-panel p-6 hover:shadow-quantum transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
                    {/* Header with visual */}
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 via-background to-secondary/10 border border-border/20 flex items-center justify-center mb-4 relative overflow-hidden">
                      <GraduationCap className="w-12 h-12 text-primary/40" />
                      {course.isFree && (
                        <span className="absolute top-3 right-3 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                          Gratis
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={levelColors[course.level]}>{levelLabels[course.level]}</Badge>
                      <Badge variant="outline" className="text-xs">{course.category}</Badge>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{course.description}</p>

                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>{course.duration} · {course.lessons.length} lecciones</span>
                      </div>
                      {course.certification && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-accent" />
                          <span>Certificación BookPI™</span>
                        </div>
                      )}
                    </div>

                    {enrollment && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progreso</span>
                          <span className="font-bold">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>
                    )}

                    <Button
                      className="w-full bg-quantum-gradient shadow-quantum"
                      onClick={() => setSelectedCourse(course)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {enrollment ? 'Continuar' : 'Ver curso'}
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Award, title: 'Certificación BookPI™', desc: 'Certificados inmutables con hash SHA3 verificable en el registro probatorio', color: 'text-accent' },
              { icon: Users, title: 'Comunidad Global', desc: 'Conecta con estudiantes y profesionales de todo LATAM', color: 'text-secondary' },
              { icon: Sparkles, title: 'Aprendizaje Inmersivo XR', desc: 'Experiencias prácticas en Dream Spaces con IA y realidad extendida', color: 'text-primary' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                  <Card className="glass-panel p-6 text-center">
                    <Icon className={`w-10 h-10 ${item.color} mx-auto mb-4`} />
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
