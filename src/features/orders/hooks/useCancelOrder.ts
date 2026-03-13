import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/api/services/order.service';
import { QueryKeys } from '@/types/api.types';
import type { CancelOrderRequest } from '@/features/orders/types';

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CancelOrderRequest) => {
      const response = await orderService.cancelOrder(data);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.orders });
    },
  });
}
