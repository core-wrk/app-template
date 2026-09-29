import { apiFetch } from './client';

export interface Session {
  user: { id: string; name: string; email: string };
  session: { id: string };
}

export function getSession(): Promise<Session | null> {
  return apiFetch<Session | null>('/api/auth/get-session');
}

export function signIn(email: string, password: string) {
  return apiFetch<Session>('/api/auth/sign-in/email', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe: true }),
  });
}

export function signUp(name: string, email: string, password: string) {
  return apiFetch<Session>('/api/auth/sign-up/email', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function signOut() {
  return apiFetch<void>('/api/auth/sign-out', { method: 'POST' });
}
