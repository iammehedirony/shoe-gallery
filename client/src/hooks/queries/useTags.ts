import { useQuery } from "@tanstack/react-query";
import { productService } from "@/src/lib/services/product.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useTags() {
  return useQuery({
    queryKey: queryKeys.products.tags(),
    queryFn: () => productService.getTags(),
  });
}
