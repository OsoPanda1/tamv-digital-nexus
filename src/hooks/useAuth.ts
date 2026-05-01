// ============================================================================
// TAMV Auth Hook - Enhanced with full authentication capabilities
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";

interface SignUpOptions {
  email: string;
  password: string;
  name?: string;
  metadata?: Record<string, any>;
}

interface SignInOptions {
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Sign up with email and password
  const signUp = useCallback(async (options: SignUpOptions): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      const { data, error }: { data: any; error: AuthError | null } = await supabase.auth.signUp({
        email: options.email,
        password: options.password,
        options: {
          data: {
            display_name: options.name || options.email.split("@")[0],
            ...options.metadata,
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        return { success: false, error: "Error al crear usuario" };
      }

      // Create profile if not auto-created
      if (!profile) {
        await supabase.from("profiles").insert([{
          user_id: data.user.id,
          email: options.email,
          display_name: options.name || options.email.split("@")[0],
          role: "public",
        }]);
      }

      toast.success("¡Registro exitoso! Por favor verifica tu correo.");
      return { success: true, user: data.user, session: data.session };
    } catch (err: any) {
      const errorMessage = err.message || "Error en el registro";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Sign in with email and password
  const signIn = useCallback(async (options: SignInOptions): Promise<AuthResult> => {
    try {
      setLoading(true);

      const { data, error }: { data: any; error: AuthError | null } = await supabase.auth.signInWithPassword({
        email: options.email,
        password: options.password,
      });

      if (error) throw error;

      if (!data.user) {
        return { success: false, error: "Credenciales inválidas" };
      }

      // Update profile last active
      await supabase
        .from("profiles")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", data.user.id);

      toast.success("¡Bienvenido de nuevo!");
      return { success: true, user: data.user, session: data.session };
    } catch (err: any) {
      const errorMessage = err.message || "Error en el login";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setProfile(null);
      toast.success("Sesión cerrada");
    } catch (err: any) {
      console.error("Sign out error:", err);
      toast.error("Error al cerrar sesión");
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast.success("Correo de recuperación enviado");
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Error al enviar correo de recuperación";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update password (when already authenticated)
  const updatePassword = useCallback(async (newPassword: string): Promise<AuthResult> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Contraseña actualizada");
      return { success: true, user: data.user };
    } catch (err: any) {
      const errorMessage = err.message || "Error al actualizar contraseña";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: Record<string, any>): Promise<AuthResult> => {
    try {
      if (!user) throw new Error("No hay usuario autenticado");

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast.success("Perfil actualizado");
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Error al actualizar perfil";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user]);

  // OAuth sign in
  const signInWithOAuth = useCallback(async (provider: "google" | "github" | "discord"): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === "google" ? "email profile" : undefined,
        },
      });

      if (error) throw error;

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Error con OAuth";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    signInWithOAuth,
  };
}

export default useAuth;
