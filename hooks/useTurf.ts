import { useQuery } from '@tanstack/react-query';
import { TURFS, type Turf } from '@/data/turf';

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function useTurfList() {
  return useQuery({
    queryKey: ['turf', 'list'],
    queryFn: async () => {
      // Simulate a network request
      await sleep(600);
      return TURFS;
    },
  });
}

export function useTurfById(id: string | undefined) {
  return useQuery({
    queryKey: ['turf', 'detail', id],
    enabled: !!id,
    queryFn: async () => {
      await sleep(450);
      const found = TURFS.find((t) => t.id === id);
      if (!found) {
        throw new Error('Turf not found');
      }
      return found satisfies Turf;
    },
  });
}
