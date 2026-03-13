import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/api/services/order.service';
import { QueryKeys } from '@/types/api.types';
import type { OrderStatus } from '@/features/orders/types';

export function useOrders(status?: OrderStatus, search?: string) {
  return useQuery({
    queryKey: search
      ? QueryKeys.ordersSearch(status ?? 'pending', search)
      : QueryKeys.ordersByStatus(status ?? 'pending'),
    queryFn: async () => {
      const response = await orderService.getOrders({ status, search: search ?? undefined });
      return response.data;
    },
  });
}
