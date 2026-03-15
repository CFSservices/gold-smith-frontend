import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/api/services/order.service';
import { QueryKeys } from '@/types/api.types';
import type { DeliverOrderRequest } from '@/features/orders/types';

export function useDeliverOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeliverOrderRequest) => {
      const response = await orderService.deliverOrder(data);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.orders });
    },
  });
}
