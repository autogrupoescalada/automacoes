"use server";

import { encodedRedirect } from "@utils/utils";
import { createClient } from "@utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/nova-conta",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect("error", "/nova-conta", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/nova-conta",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/entrar", error.message);
  }

  return redirect("/area");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl") as string;

  if (!email) {
    return encodedRedirect("error", "/esqueci-senha", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/redefinir-senha`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect("error", "/esqueci-senha", "Could not reset password");
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/esqueci-senha",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/redefinir-senha",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/redefinir-senha",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/redefinir-senha",
      "Password update failed",
    );
  }

  return encodedRedirect("success", "/redefinir-senha", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/entrar");
};

/**
 * Ação para buscar o profile do usuário logado
 */
export const getUserProfileAction = async () => {
  const supabase = await createClient();

  // Obtem a sessão atual
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // Se não houver sessão ou der erro, redireciona
  if (!session?.user || sessionError) {
    return encodedRedirect("error", "/entrar", "Usuário não autenticado");
  }

  // Busca o profile na tabela "profiles", usando o user_id do usuário logado
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/area",
      "Não foi possível obter o perfil do usuário",
    );
  }

  // Se você quiser simplesmente retornar os dados para uso no servidor,
  // retorne-os como objeto. Se precisar exibir algo na tela,
  // pode fazer isso a partir do componente que chamar essa ação.
  return data;
};
