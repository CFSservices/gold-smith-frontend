/**
 * Jewel Product API service
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  JewelProduct,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export const jewelProductService = {
  /**
   * Get paginated list of jewel products
   */
  getJewelProducts: (params?: PaginationParams) =>
    api.get<PaginatedResponse<JewelProduct>>(API_ENDPOINTS.jewelProducts.list, { params }),

  /**
   * Get jewel product by ID
   */
  getJewelProductById: (id: string) =>
    api.get<JewelProduct>(API_ENDPOINTS.jewelProducts.detail(id)),

  /**
   * Create new jewel product (admin) - JSON payload
   */
  createJewelProduct: (data: FormData) =>
    api.post<JewelProduct>(API_ENDPOINTS.jewelProducts.create, data),

  /**
   * Update jewel product
   */
  updateJewelProduct: (id: string, data: FormData) =>
    api.patch<JewelProduct>(API_ENDPOINTS.jewelProducts.update(id), data),

  /**
   * Delete jewel product
   */
  deleteJewelProduct: (id: string) =>
    api.delete<void>(API_ENDPOINTS.jewelProducts.delete(id)),
};
