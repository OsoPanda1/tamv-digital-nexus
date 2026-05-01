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
  lessons: Array<{ id: string; title: string; order: number }>;
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
    totalCourses: 0, totalStudents: 0, certificatesIssued: 0, freeCourses: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    const { data: coursesData, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('enrollment_count', { ascending: false });

    if (error || !coursesData) { setLoading(false); return; }

    // No course_lessons table exists - courses have no nested lessons yet
    const enriched: CourseWithLessons[] = coursesData.map(c => ({
      ...c,
      lessons: [],
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

    const { data: enrollData } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', user.id);

    if (enrollData) {
      const map: Record<string, EnrollmentRow> = {};
      enrollData.forEach(e => { map[e.course_id] = e as unknown as EnrollmentRow; });
      setEnrollments(map);
    }
  }, [user]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  const enrollInCourse = useCallback(async (courseId: string): Promise<boolean> => {
    if (!user) { toast.error('Inicia sesión para inscribirte'); return false; }
    if (enrollments[courseId]) return true;

    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({ course_id: courseId, user_id: user.id, progress: 0 })
      .select()
      .single();

    if (error) { toast.error('Error al inscribirse'); return false; }
    setEnrollments(prev => ({ ...prev, [courseId]: data as unknown as EnrollmentRow }));
    toast.success('¡Inscripción exitosa!');
    return true;
  }, [user, enrollments]);

  const completeLesson = useCallback(async (_courseId: string, lessonId: string): Promise<void> => {
    if (!user) return;
    setLessonProgress(prev => ({ ...prev, [lessonId]: true }));
    toast.success('✅ Lección completada');
  }, [user]);

  const getCourseProgress = useCallback((courseId: string): number => {
    return enrollments[courseId]?.progress ?? 0;
  }, [enrollments]);

  const isEnrolled = useCallback((courseId: string): boolean => !!enrollments[courseId], [enrollments]);
  const isLessonCompleted = useCallback((lessonId: string): boolean => lessonProgress[lessonId] ?? false, [lessonProgress]);
  const hasCertificate = useCallback((courseId: string): boolean => certificates.some(c => c.course_id === courseId), [certificates]);

  return {
    courses, enrollments, certificates, stats, loading,
    enrollInCourse, completeLesson, getCourseProgress,
    isEnrolled, isLessonCompleted, hasCertificate,
    refresh: fetchCourses,
  };
}
