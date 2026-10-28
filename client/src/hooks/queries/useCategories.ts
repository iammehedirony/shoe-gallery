import { useQuery } from "@tanstack/react-query";
import { productService } from "@/src/lib/services/product.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.products.categories(),
    queryFn: () => productService.getCategories(),
  });
}
