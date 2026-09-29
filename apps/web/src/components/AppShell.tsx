import { useQueryClient } from '@tanstack/react-query';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from './Button';
import { signOut } from '../lib/api/auth';
import { useSession } from '../hooks/use-session';

export function AppShell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  async function handleSignOut() {
    await signOut();
    await queryClient.invalidateQueries({ queryKey: ['session'] });
    navigate('/sign-in');
  }

  return (
    <div className="min-h-screen bg-mist text-ink">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="flex items-center gap-2" aria-label="Main navigation">
            <NavLink
              className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              to="/dashboard"
            >
              Dashboard
            </NavLink>
            <Link className="hidden text-sm text-slate-500 sm:block" to="/status">
              Status
            </Link>
            <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
            <span className="hidden text-sm text-slate-500 md:block">{session?.user.name}</span>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
