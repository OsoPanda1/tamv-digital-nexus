import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  BookOpen, Award, Users, Video, FileText, Sparkles,
  GraduationCap, Play, CheckCircle, Clock, Search,
  Lock, ChevronLeft, Star, TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUniversity, type CourseWithLessons, type CourseLessonRow } from '@/hooks/useUniversity';

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
  intermediate: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  advanced: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  expert: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  expert: 'Experto',
};

const LESSON_TYPE_ICONS: Record<string, string> = {
  video: '🎥',
  quiz: '📝',
  practice: '🛠️',
  text: '📖',
};

const CATEGORY_COLORS: Record<string, string> = {
  Fundamentos: 'from-blue-600/30 to-blue-900/20',
  Colaboración: 'from-teal-600/30 to-teal-900/20',
  Desarrollo: 'from-orange-600/30 to-orange-900/20',
  Seguridad: 'from-red-600/30 to-red-900/20',
  Audio: 'from-purple-600/30 to-purple-900/20',
  IA: 'from-pink-600/30 to-pink-900/20',
};

function LessonRow({
  lesson,
  index,
  isCompleted,
  isActive,
  canAccess,
  onClick,
}: {
  lesson: CourseLessonRow;
  index: number;
  isCompleted: boolean;
  isActive: boolean;
  canAccess: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={canAccess ? onClick : undefined}
      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 border ${
        isActive
          ? 'bg-primary/20 border-primary/30'
          : isCompleted
          ? 'bg-green-500/10 border-green-500/20'
          : 'bg-card/50 border-border/20 hover:bg-card/80'
      } ${!canAccess ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={!canAccess}
    >
      <span className="text-xs font-mono text-muted-foreground w-6">
        {String(index + 1).padStart(2, '0')}
      </span>
      {isCompleted ? (
        <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
      ) : !canAccess ? (
        <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
      ) : (
        <Play className="w-4 h-4 text-muted-foreground shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{lesson.title}</p>
        <p className="text-xs text-muted-foreground">
          {LESSON_TYPE_ICONS[lesson.lesson_type]} {lesson.duration_minutes} min
        </p>
      </div>
    </button>
  );
}

function CourseDetail({
  course,
  onBack,
}: {
  course: CourseWithLessons;
  onBack: () => void;
}) {
  const {
    isEnrolled,
    isLessonCompleted,
    hasCertificate,
    getCourseProgress,
    enrollInCourse,
    completeLesson,
  } = useUniversity();

  const [activeLesson, setActiveLesson] = useState<CourseLessonRow | null>(null);
  const enrolled = isEnrolled(course.id);
  const progress = getCourseProgress(course.id);
  const certified = hasCertificate(course.id);
  const isFree = (course.price ?? 0) === 0;

  const handleEnroll = async () => {
    const ok = await enrollInCourse(course.id);
    if (ok && course.lessons.length > 0) {
      setActiveLesson(course.lessons[0]);
    }
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson) return;
    await completeLesson(course.id, activeLesson.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <QuantumCanvas />
      <Navigation />
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" /> Volver a cursos
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass-panel p-8 mb-6">
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                    <Badge className={LEVEL_COLORS[course.level ?? 'beginner']}>
                      {LEVEL_LABELS[course.level ?? 'beginner']}
                    </Badge>
                    <div className="flex gap-2">
                      {isFree && <Badge className="bg-green-500/20 text-green-300">Gratis</Badge>}
                      {certified && (
                        <Badge className="bg-accent/20 text-accent border-accent/30">
                          <Award className="w-3 h-3 mr-1" /> Certificado
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
                  <p className="text-muted-foreground mb-6">{course.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {course.duration_hours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-4 h-4" /> {course.lessons.length} lecciones
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" /> {course.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />{' '}
                      {(course.enrollment_count ?? 0).toLocaleString()} estudiantes
                    </span>
                  </div>
                </Card>

                {activeLesson && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card className="glass-panel p-8 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">{activeLesson.title}</h2>
                        <Badge variant="outline">
                          {LESSON_TYPE_ICONS[activeLesson.lesson_type]}{' '}
                          {activeLesson.lesson_type === 'video'
                            ? 'Video'
                            : activeLesson.lesson_type === 'quiz'
                            ? 'Quiz'
                            : activeLesson.lesson_type === 'practice'
                            ? 'Práctica'
                            : 'Lectura'}
                        </Badge>
                      </div>

                      <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 via-background to-secondary/20 border border-border/30 flex items-center justify-center mb-6">
                        <div className="text-center">
                          <Play className="w-16 h-16 text-primary mx-auto mb-4 opacity-60" />
                          <p className="text-muted-foreground">Contenido de la lección</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activeLesson.duration_minutes} min
                          </p>
                        </div>
                      </div>

                      {!isLessonCompleted(activeLesson.id) ? (
                        <Button
                          className="w-full bg-quantum-gradient shadow-quantum"
                          onClick={handleCompleteLesson}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Marcar como completada
                        </Button>
                      ) : (
                        <div className="text-center text-green-400 font-bold flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5" /> Lección completada
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </div>

            <div>
              <Card className="glass-panel p-6 sticky top-32">
                {enrolled ? (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progreso</span>
                      <span className="font-bold text-primary">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    {certified && (
                      <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                        <Award className="w-6 h-6 text-accent mx-auto mb-1" />
                        <p className="text-sm font-bold text-green-300">¡Certificado obtenido!</p>
                        <p className="text-xs text-muted-foreground">Registrado en BookPI™</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    className="w-full mb-6 bg-quantum-gradient shadow-quantum"
                    onClick={handleEnroll}
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {isFree ? 'Inscribirse gratis' : `Inscribirse · $${course.price}`}
                  </Button>
                )}

                <h3 className="font-bold mb-4">Lecciones ({course.lessons.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {course.lessons.map((lesson, i) => (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      index={i}
                      isCompleted={isLessonCompleted(lesson.id)}
                      isActive={activeLesson?.id === lesson.id}
                      canAccess={enrolled || lesson.is_free_preview}
                      onClick={() => setActiveLesson(lesson)}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CourseCard({
  course,
  onSelect,
}: {
  course: CourseWithLessons;
  onSelect: () => void;
}) {
  const { isEnrolled, getCourseProgress, hasCertificate } = useUniversity();
  const enrolled = isEnrolled(course.id);
  const progress = getCourseProgress(course.id);
  const certified = hasCertificate(course.id);
  const isFree = (course.price ?? 0) === 0;
  const gradient = CATEGORY_COLORS[course.category ?? ''] ?? 'from-primary/20 to-secondary/10';

  return (
    <Card className="glass-panel p-6 hover:shadow-quantum transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
      <div
        className={`aspect-video rounded-xl bg-gradient-to-br ${gradient} border border-border/20 flex items-center justify-center mb-4 relative overflow-hidden`}
      >
        <GraduationCap className="w-12 h-12 text-primary/40" />
        <div className="absolute top-3 right-3 flex gap-2">
          {isFree && (
            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
              Gratis
            </span>
          )}
          {certified && (
            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full border border-accent/30">
              ✓ Cert.
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge className={LEVEL_COLORS[course.level ?? 'beginner']}>
          {LEVEL_LABELS[course.level ?? 'beginner']}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {course.category}
        </Badge>
      </div>

      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
        {course.description}
      </p>

      <div className="space-y-1 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4" />
          <span>
            {course.duration_hours}h · {course.lessons.length} lecciones
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{(course.enrollment_count ?? 0).toLocaleString()} estudiantes</span>
        </div>
      </div>

      {enrolled && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Progreso</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <Button className="w-full bg-quantum-gradient shadow-quantum" onClick={onSelect}>
        <BookOpen className="w-4 h-4 mr-2" />
        {enrolled ? 'Continuar' : 'Ver curso'}
      </Button>
    </Card>
  );
}

type FilterType = 'all' | 'free' | 'paid' | 'enrolled';

export default function University() {
  const { courses, certificates, stats, loading } = useUniversity();
  const [selectedCourse, setSelectedCourse] = useState<CourseWithLessons | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const { enrollments } = useUniversity();

  const filteredCourses = useMemo(() => {
    let list = courses;
    if (filter === 'free') list = list.filter(c => (c.price ?? 0) === 0);
    if (filter === 'paid') list = list.filter(c => (c.price ?? 0) > 0);
    if (filter === 'enrolled') list = list.filter(c => !!enrollments[c.id]);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          (c.description ?? '').toLowerCase().includes(q) ||
          (c.category ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [courses, filter, search, enrollments]);

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <QuantumCanvas />
      <Navigation />
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                🎓 Universidad TAMV
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Formación gratuita y certificada en tecnologías cuánticas, metaverso y desarrollo
              avanzado. Certificaciones verificables en BookPI™.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              {[
                { icon: BookOpen, label: 'Cursos', value: stats.totalCourses, color: 'text-primary' },
                { icon: Users, label: 'Estudiantes', value: stats.totalStudents.toLocaleString(), color: 'text-secondary' },
                { icon: Award, label: 'Certificados', value: certificates.length, color: 'text-accent' },
                { icon: Star, label: 'Gratuitos', value: stats.freeCourses, color: 'text-green-400' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <Card key={item.label} className="glass-panel p-4 text-center">
                    <Icon className={`w-6 h-6 ${item.color} mx-auto mb-1`} />
                    <p className="text-xl font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar cursos..."
                className="pl-9 bg-card/50 border-border/30"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {([
                { key: 'all', label: 'Todos' },
                { key: 'free', label: '🆓 Gratuitos' },
                { key: 'paid', label: '⭐ Pro' },
                { key: 'enrolled', label: '📚 Inscritos' },
              ] as { key: FilterType; label: string }[]).map(f => (
                <Button
                  key={f.key}
                  variant={filter === f.key ? 'default' : 'outline'}
                  onClick={() => setFilter(f.key)}
                  className={filter === f.key ? 'bg-quantum-gradient shadow-quantum' : ''}
                  size="sm"
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="glass-panel p-6 h-80 animate-pulse">
                  <div className="aspect-video rounded-xl bg-border/20 mb-4" />
                  <div className="h-4 bg-border/20 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-border/20 rounded w-1/2" />
                </Card>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No se encontraron cursos</p>
              <p className="text-sm mt-1">Intenta con otros filtros o términos de búsqueda</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CourseCard course={course} onSelect={() => setSelectedCourse(course)} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Certificación BookPI™',
                desc: 'Certificados inmutables con hash SHA3 verificable en el registro probatorio',
                color: 'text-accent',
              },
              {
                icon: TrendingUp,
                title: 'Aprendizaje Adaptativo',
                desc: 'Rutas de aprendizaje personalizadas con Isabella AI según tu nivel y objetivos',
                color: 'text-secondary',
              },
              {
                icon: Sparkles,
                title: 'Aprendizaje Inmersivo XR',
                desc: 'Experiencias prácticas en Dream Spaces con IA y realidad extendida',
                color: 'text-primary',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
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
