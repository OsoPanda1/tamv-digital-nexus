// ============================================================================
// TAMV Auth Service - Edge Function
// Handles authentication, registration, password reset
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { action, email, password, name, metadata } = body;

    let result;

    switch (action) {
      case "register": {
        // Check if user already exists
        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", email)
          .single();

        if (existing) {
          throw new Error("El correo ya está registrado");
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name || email.split("@")[0],
              ...metadata,
            },
          },
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Error al crear usuario");

        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email,
          display_name: name || email.split("@")[0],
          full_name: name,
          role: "public",
        });

        if (profileError) {
          // Rollback auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw profileError;
        }

        // Log security event
        await supabase.from("security_events").insert({
          user_id: authData.user.id,
          event_type: "user_registered",
          severity: "info",
          description: "New user registration",
          metadata: { email: email.slice(0, 3) + "***" },
        });

        result = {
          user: authData.user,
          session: authData.session,
          message: "Usuario registrado exitosamente",
        };
        break;
      }

      case "login": {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Credenciales inválidas");

        // Update last active
        await supabase
          .from("profiles")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", authData.user.id);

        // Log security event
        await supabase.from("security_events").insert({
          user_id: authData.user.id,
          event_type: "user_login",
          severity: "info",
          description: "User login",
        });

        result = {
          user: authData.user,
          session: authData.session,
          message: "Login exitoso",
        };
        break;
      }

      case "reset_password": {
        const { data: resetData, error: resetError } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${req.headers.get("origin") || "https://tamv.com"}/auth/reset-password`,
          }
        );

        if (resetError) throw resetError;

        result = { message: "Correo de recuperación enviado" };
        break;
      }

      case "update_password": {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) throw new Error("No autorizado");

        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: updateError } = await supabase.auth.updateUser(
          { password },
          { bypassRouter: true }
        );

        if (updateError) throw updateError;

        // Log security event
        await supabase.from("security_events").insert({
          user_id: user?.id,
          event_type: "password_updated",
          severity: "warning",
          description: "User password updated",
        });

        result = { message: "Contraseña actualizada", user };
        break;
      }

      case "verify_email": {
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token: body.token,
          type: "email",
        });

        if (verifyError) throw verifyError;

        result = { message: "Email verificado", session: verifyData.session };
        break;
      }

      default:
        throw new Error("Acción no válida");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Auth Service Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error de autenticación" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
