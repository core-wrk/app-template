import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiRequestError } from '../lib/api/client';
import { signIn, signUp } from '../lib/api/auth';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { useQueryClient } from '@tanstack/react-query';
import { branding } from '@core-wrk/shared';

export function SignInPage() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (mode === 'sign-up') await signUp(name, email, password);
      else await signIn(email, password);
      await queryClient.invalidateQueries({ queryKey: ['session'] });
      navigate(destination);
    } catch (cause) {
      setError(
        cause instanceof ApiRequestError ? cause.message : 'We could not complete that request.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-mist lg:grid-cols-2">
      <div className="hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo />
        <div className="max-w-md pb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-200">
            {branding.applicationName}
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight">
            The useful middle ground between a sketch and a system.
          </h1>
          <p className="mt-5 leading-7 text-slate-300">
            Keep the product close, the architecture legible, and the next decision easy to make.
          </p>
        </div>
        <p className="text-sm text-slate-400">Portable by design · ready for iteration</p>
      </div>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <p className="text-sm font-semibold text-moss">
            {mode === 'sign-in' ? 'Welcome back' : 'Start a workspace'}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {mode === 'sign-in' ? 'Sign in' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {mode === 'sign-in'
              ? 'Use your account to open the dashboard.'
              : 'A real email is not required for local development.'}
          </p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === 'sign-up' && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-moss focus:ring-4 focus:ring-moss/20"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-moss focus:ring-4 focus:ring-moss/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-moss focus:ring-4 focus:ring-moss/20"
              />
            </div>
            {error && (
              <p className="text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? 'Working…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
            </Button>
          </form>
          <button
            className="mt-6 w-full text-sm font-semibold text-moss hover:text-teal-800"
            onClick={() => {
              setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
              setError('');
            }}
            type="button"
          >
            {mode === 'sign-in'
              ? 'Need an account? Create one'
              : 'Already have an account? Sign in'}
          </button>
          <Link className="mt-4 block text-center text-sm text-slate-500 hover:text-moss" to="/">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
