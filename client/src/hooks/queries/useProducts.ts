import { useQuery } from "@tanstack/react-query";
import { productService } from "@/src/lib/services/product.service";
import { queryKeys } from "@/src/lib/query/query-keys";

export function useProducts(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productService.getProducts(params),
  });
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
}
