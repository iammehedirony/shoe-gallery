import { useQuery } from "@tanstack/react-query";
import { orderService, AdminOrder } from "@/src/lib/services/order.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useOrders() {
  return useQuery<AdminOrder[], Error>({
    queryKey: queryKeys.orders.list(),
    queryFn: () => orderService.getAdminOrders(),
  });
}
