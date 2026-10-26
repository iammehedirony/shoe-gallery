import { useQuery } from "@tanstack/react-query";
import { statsService, DashboardStats } from "@/src/lib/services/stats.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useDashboardStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => statsService.getStats(),
  });
}
