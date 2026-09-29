import { useQuery } from '@tanstack/react-query';
import { getSession } from '../lib/api/auth';

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: 60_000,
    retry: false,
  });
}
