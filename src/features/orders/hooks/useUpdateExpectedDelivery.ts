import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/api/services/order.service';
import { QueryKeys } from '@/types/api.types';
import type { UpdateExpectedDeliveryRequest } from '@/features/orders/types';

export function useUpdateExpectedDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateExpectedDeliveryRequest) => {
      const response = await orderService.updateExpectedDelivery(data);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.orders });
    },
  });
}
