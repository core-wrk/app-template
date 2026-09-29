import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { apiFetch } from '../lib/api/client';

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export function StatusPage() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => apiFetch<HealthResponse>('/api/health'),
    retry: false,
  });
  return (
    <div className="min-h-screen bg-mist px-6 py-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Logo />
          <Link className="text-sm font-semibold text-moss" to="/">
            Home
          </Link>
        </div>
        <section className="mt-20 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-moss">System status</p>
          <h1 className="mt-2 text-3xl font-semibold">A quick pulse check.</h1>
          <div className="mt-8 flex items-center justify-between rounded-xl bg-mist p-5">
            <div>
              <p className="font-semibold">API service</p>
              <p className="mt-1 text-sm text-slate-500">
                {health.data?.timestamp
                  ? `Last checked ${new Date(health.data.timestamp).toLocaleTimeString()}`
                  : 'Checking the local API…'}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${health.isSuccess ? 'bg-emerald-100 text-emerald-800' : health.isPending ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}
            >
              {health.isSuccess ? 'Operational' : health.isPending ? 'Checking' : 'Unavailable'}
            </span>
          </div>
          {health.isError && (
            <p className="mt-5 text-sm text-red-700">
              Start the API with <code>pnpm dev</code> to see a live status.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
