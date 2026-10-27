import { useQuery } from "@tanstack/react-query";
import { customerService, Customer } from "@/src/lib/services/customer.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useCustomers() {
  return useQuery<Customer[], Error>({
    queryKey: queryKeys.customers.list(),
    queryFn: () => customerService.getCustomers(),
  });
}
