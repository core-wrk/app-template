import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../hooks/use-session';

export function ProtectedRoute() {
  const location = useLocation();
  const session = useSession();

  if (session.isPending) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-slate-500">
        Checking your session…
      </div>
    );
  }

  if (!session.data) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
