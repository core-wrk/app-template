import { Link } from 'react-router-dom';
import { branding } from '@core-wrk/shared';

export function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-3 font-semibold tracking-tight text-ink">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-moss text-sm font-bold text-white">
        CW
      </span>
      <span>{branding.applicationName}</span>
    </Link>
  );
}
