import { useQuery } from "@tanstack/react-query";
import { inventoryService, InventoryResponse } from "@/src/lib/services/inventory.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useInventory() {
  return useQuery<InventoryResponse, Error>({
    queryKey: queryKeys.inventory.list(),
    queryFn: () => inventoryService.getInventory(),
  });
}
