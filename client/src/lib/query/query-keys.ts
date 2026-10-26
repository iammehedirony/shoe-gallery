export const queryKeys = {
  all: ["jh-shoe-gallery"] as const,
  dashboard: {
    all: () => [...queryKeys.all, "dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all(), "stats"] as const,
  },
  products: {
    all: () => [...queryKeys.all, "products"] as const,
    lists: () => [...queryKeys.products.all(), "list"] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all(), "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  inventory: {
    all: () => [...queryKeys.all, "inventory"] as const,
    list: () => [...queryKeys.inventory.all(), "list"] as const,
  },
  orders: {
    all: () => [...queryKeys.all, "orders"] as const,
    list: () => [...queryKeys.orders.all(), "list"] as const,
  },
  customers: {
    all: () => [...queryKeys.all, "customers"] as const,
    list: () => [...queryKeys.customers.all(), "list"] as const,
  },
  cms: {
    all: () => [...queryKeys.all, "cms"] as const,
    banners: () => [...queryKeys.cms.all(), "banners"] as const,
  },
};
