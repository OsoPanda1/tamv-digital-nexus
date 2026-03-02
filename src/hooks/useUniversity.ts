import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CourseWithLessons {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  duration_hours: number | null;
  price: number | null;
  thumbnail_url: string | null;
  is_published: boolean | null;
  enrollment_count: number | null;
  lessons: CourseLessonRow[];
}

export interface CourseLessonRow {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  lesson_order: number;
  duration_minutes: number;
  lesson_type: string;
  is_free_preview: boolean;
}

export interface EnrollmentRow {
  id: string;
  course_id: string;
  user_id: string;
  progress: number | null;
  completed: boolean | null;
  enrolled_at: string | null;
  completed_at: string | null;
}

export interface LessonProgressRow {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface CertificateRow {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  issued_at: string;
  verification_url: string;
  bookpi_event_id: string | null;
}

export interface UniversityStats {
  totalCourses: number;
  totalStudents: number;
  certificatesIssued: number;
  freeCourses: number;
}

export function useUniversity() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithLessons[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, EnrollmentRow>>({});
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);
  const [stats, setStats] = useState<UniversityStats>({
    totalCourses: 0,
    totalStudents: 0,
    certificatesIssued: 0,
    freeCourses: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('enrollment_count', { ascending: false });

    if (coursesError || !coursesData) {
      setLoading(false);
      return;
    }

    const courseIds = coursesData.map(c => c.id);
    const { data: lessonsData } = await supabase
      .from('course_lessons')
      .select('*')
      .in('course_id', courseIds)
      .order('lesson_order', { ascending: true });

    const lessonsByCourse: Record<string, CourseLessonRow[]> = {};
    (lessonsData ?? []).forEach(l => {
      if (!lessonsByCourse[l.course_id]) lessonsByCourse[l.course_id] = [];
      lessonsByCourse[l.course_id].push(l);
    });

    const enriched: CourseWithLessons[] = coursesData.map(c => ({
      ...c,
      lessons: lessonsByCourse[c.id] ?? [],
    }));

    setCourses(enriched);

    setStats({
      totalCourses: coursesData.length,
      freeCourses: coursesData.filter(c => (c.price ?? 0) === 0).length,
      totalStudents: coursesData.reduce((sum, c) => sum + (c.enrollment_count ?? 0), 0),
      certificatesIssued: 0,
    });

    setLoading(false);
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!user) return;

    const [enrollRes, progressRes, certRes] = await Promise.all([
      supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('course_certificates')
        .select('*')
        .eq('user_id', user.id),
    ]);

    if (enrollRes.data) {
      const map: Record<string, EnrollmentRow> = {};
      enrollRes.data.forEach(e => { map[e.course_id] = e; });
      setEnrollments(map);
    }

    if (progressRes.data) {
      const map: Record<string, boolean> = {};
      progressRes.data.forEach(p => { map[p.lesson_id] = p.completed; });
      setLessonProgress(map);
    }

    if (certRes.data) {
      setCertificates(certRes.data);
      setStats(prev => ({ ...prev, certificatesIssued: certRes.data!.length }));
    }
  }, [user]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const enrollInCourse = useCallback(async (courseId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Inicia sesión para inscribirte');
      return false;
    }

    if (enrollments[courseId]) return true;

    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({ course_id: courseId, user_id: user.id, progress: 0 })
      .select()
      .single();

    if (error) {
      toast.error('Error al inscribirse');
      return false;
    }

    setEnrollments(prev => ({ ...prev, [courseId]: data }));
    toast.success('¡Inscripción exitosa! Bienvenido al curso.');
    return true;
  }, [user, enrollments]);

  const completeLesson = useCallback(async (courseId: string, lessonId: string): Promise<void> => {
    if (!user || lessonProgress[lessonId]) return;

    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        course_id: courseId,
        completed: true,
        completed_at: new Date().toISOString(),
      });

    if (error) return;

    setLessonProgress(prev => ({ ...prev, [lessonId]: true }));

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const completedCount = course.lessons.filter(l =>
      l.id === lessonId || lessonProgress[l.id]
    ).length;
    const totalLessons = course.lessons.length;
    const newProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const isCompleted = newProgress >= 100;

    const { data: updated } = await supabase
      .from('course_enrollments')
      .update({
        progress: newProgress,
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      })
      .eq('course_id', courseId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updated) {
      setEnrollments(prev => ({ ...prev, [courseId]: updated }));
    }

    if (isCompleted) {
      const courseTitle = course.title;
      const verificationUrl = `https://tamv.network/certificates/${user.id}/${courseId}`;

      const { data: cert } = await supabase
        .from('course_certificates')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          course_title: courseTitle,
          verification_url: verificationUrl,
        })
        .select()
        .single();

      const { data: bookpiId } = await (supabase as any).rpc('create_bookpi_event', {
        p_event_type: 'certification_earned',
        p_actor_id: user.id,
        p_resource_type: 'course',
        p_resource_id: courseId,
        p_payload: {
          course_title: courseTitle,
          completed_at: new Date().toISOString(),
          verification_url: verificationUrl,
        },
      });

      if (cert && bookpiId) {
        await supabase
          .from('course_certificates')
          .update({ bookpi_event_id: bookpiId })
          .eq('id', cert.id);
      }

      if (cert) {
        setCertificates(prev => {
          const exists = prev.some(c => c.course_id === courseId);
          return exists ? prev : [...prev, cert];
        });
      }

      toast.success('🎓 ¡Curso completado! Tu certificación ha sido registrada en BookPI™.');
    } else {
      toast.success('✅ Lección completada');
    }
  }, [user, lessonProgress, courses]);

  const getCourseProgress = useCallback((courseId: string): number => {
    return enrollments[courseId]?.progress ?? 0;
  }, [enrollments]);

  const isEnrolled = useCallback((courseId: string): boolean => {
    return !!enrollments[courseId];
  }, [enrollments]);

  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    return lessonProgress[lessonId] ?? false;
  }, [lessonProgress]);

  const hasCertificate = useCallback((courseId: string): boolean => {
    return certificates.some(c => c.course_id === courseId);
  }, [certificates]);

  return {
    courses,
    enrollments,
    certificates,
    stats,
    loading,
    enrollInCourse,
    completeLesson,
    getCourseProgress,
    isEnrolled,
    isLessonCompleted,
    hasCertificate,
    refresh: fetchCourses,
  };
}
