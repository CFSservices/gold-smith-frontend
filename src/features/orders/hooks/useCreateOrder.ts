import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/api/services/order.service';
import { QueryKeys } from '@/types/api.types';
import type { CreateOrderRequest } from '@/features/orders/types';

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderRequest) => {
      const response = await orderService.createOrder(data);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.orders });
    },
  });
}
