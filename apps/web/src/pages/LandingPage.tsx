import { Link } from 'react-router-dom';
import { branding } from '@core-wrk/shared';
import { Logo } from '../components/Logo';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-mist text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <Link className="text-sm font-semibold text-slate-600 hover:text-moss" to="/status">
            System status
          </Link>
          <Link
            className="rounded-lg bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            to="/sign-in"
          >
            Sign in
          </Link>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <section>
          <p className="mb-5 inline-flex rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">
            A calm place to build
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Turn a good idea into a working product.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            {branding.description} Start with the reference projects workspace, then shape it into
            the application your team needs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
              to="/sign-in"
            >
              Open the workspace
            </Link>
            <Link
              className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink hover:border-moss hover:text-moss"
              to="/status"
            >
              Check the API
            </Link>
          </div>
        </section>
        <section
          className="rounded-3xl border border-white bg-white p-6 shadow-xl shadow-teal-900/5"
          aria-label="Starter architecture summary"
        >
          <div className="rounded-2xl bg-ink p-6 text-white">
            <p className="text-sm font-semibold text-teal-200">Reference workspace</p>
            <p className="mt-8 text-3xl font-semibold">Projects that stay in motion.</p>
            <div className="mt-10 space-y-3">
              {[
                'React + Vite frontend',
                'Hono + TypeScript API',
                'PostgreSQL + Drizzle',
                'Better Auth sessions',
              ].map((item) => (
                <div
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm text-slate-200"
                  key={item}
                >
                  <span className="h-2 w-2 rounded-full bg-coral" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
