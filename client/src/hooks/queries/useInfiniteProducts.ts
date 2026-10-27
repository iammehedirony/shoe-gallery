import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/src/lib/services/product.service";
import { queryKeys } from "@/src/lib/query/query-keys";

interface UseInfiniteProductsParams {
  category?: string;
  tag?: string;
  size?: string;
  sort?: string;
  search?: string;
  limit?: number;
}

export function useInfiniteProducts(params?: UseInfiniteProductsParams) {
  const limit = params?.limit || 12;

  return useInfiniteQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams: Record<string, any> = {
        page: pageParam,
        limit,
        ...params,
      };

      const response = await productService.getProducts(queryParams);

      // Handle different response structures
      const data = response?.data || response;
      const products = data?.products || (Array.isArray(data) ? data : []);
      const pagination = data?.pagination || {
        total: products.length,
        page: pageParam,
        limit,
        totalPages: 1,
      };

      return {
        products,
        pagination,
      };
    },
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (pagination.page < pagination.totalPages) {
        return pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
