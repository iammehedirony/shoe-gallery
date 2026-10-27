import { useQuery } from "@tanstack/react-query";
import { cmsService, Banner } from "@/src/lib/services/cms.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useBanners(type?: string) {
  return useQuery<Banner[], Error>({
    queryKey: [...queryKeys.cms.banners(), type],
    queryFn: () => cmsService.getBanners(type),
  });
}
