declare module '@utils/supabase/server' {
  interface User {
    id: string;
    email?: string;
    [key: string]: unknown;
  }

  interface Session {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    user: User;
  }

  interface AuthResponse {
    data: {
      user: User | null;
      session: Session | null;
    };
    error: Error | null;
  }

  interface QueryResult<T> {
    data: T[] | null;
    error: Error | null;
  }

  interface QueryBuilder<T> {
    select<TReturn = T, _TBody = unknown>(columns?: string): QueryBuilder<TReturn>;
    order(column: string, options?: { ascending?: boolean }): QueryBuilder<T>;
    single(): Promise<{ data: T | null; error: Error | null }>;
    insert<U>(values: U[]): QueryBuilder<T>;
    then<TResult1 = QueryResult<T>, TResult2 = never>(
      onfulfilled?: ((value: QueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
    ): Promise<TResult1 | TResult2>;
  }

  interface SupabaseClient {
    auth: {
      getUser(): Promise<AuthResponse>;
      getSession(): Promise<AuthResponse>;
      signOut(): Promise<{ error: Error | null }>;
      signUp(options: { email: string; password: string; options?: Record<string, unknown> }): Promise<AuthResponse>;
      signInWithPassword(options: { email: string; password: string }): Promise<AuthResponse>;
      resetPasswordForEmail(email: string, options?: Record<string, unknown>): Promise<{ error: Error | null }>;
      updateUser(options: { password: string }): Promise<AuthResponse>;
      exchangeCodeForSession(code: string): Promise<{ error: Error | null }>;
    };
    from(table: string): QueryBuilder<unknown>;
  }

  export function createClient(): Promise<SupabaseClient>;
}

declare module '@utils/supabase/middleware' {
  import type { NextRequest, NextResponse } from 'next/server';
  export function updateSession(request: NextRequest): Promise<NextResponse>;
}

declare module '@utils/supabase/check-env-vars' {
  export const hasEnvVars: boolean;
} 