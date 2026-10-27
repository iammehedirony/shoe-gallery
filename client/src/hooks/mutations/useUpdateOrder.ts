import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/src/lib/services/order.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      orderService.updateOrderStatus({ orderId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, paymentStatus }: { orderId: string; paymentStatus: string }) =>
      orderService.updatePaymentStatus({ orderId, paymentStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}
