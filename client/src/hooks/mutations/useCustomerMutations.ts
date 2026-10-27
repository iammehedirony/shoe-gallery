import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService, CreateCustomerInput, Customer } from "@/src/lib/services/customer.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerInput) => customerService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      customerService.updateCustomer({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}
