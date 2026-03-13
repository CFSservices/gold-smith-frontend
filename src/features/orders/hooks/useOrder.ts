import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/api/services/order.service';
import { QueryKeys } from '@/types/api.types';
import type { ID } from '@/types/common.types';

export function useOrder(id: ID | null) {
  return useQuery({
    queryKey: QueryKeys.order(id ?? ''),
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const response = await orderService.getOrder(id!);
      return response.data;
    },
    enabled: id !== null,
  });
}
