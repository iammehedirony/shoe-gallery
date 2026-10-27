import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsService, Banner } from "@/src/lib/services/cms.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Banner>) => cmsService.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cms.all() });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cmsService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cms.all() });
    },
  });
}
