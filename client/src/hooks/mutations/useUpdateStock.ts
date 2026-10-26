import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "@/src/lib/services/inventory.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantId, stock }: { variantId: string; stock: number }) =>
      inventoryService.updateStock({ variantId, stock }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}
