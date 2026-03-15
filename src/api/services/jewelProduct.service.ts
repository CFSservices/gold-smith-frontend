/**
 * Jewel Product API service
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  JewelProduct,
  PaginatedResponse,
  PaginationParams,
  StockItem,
} from '@/types';

export interface StockItemUpsertPayload {
  stockId: string;
  purity: string;
  status: string;
}

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
    api.put<JewelProduct>(API_ENDPOINTS.jewelProducts.update(id), data),

  /**
   * Archive jewel product
   */
  archiveJewelProduct: (id: string) =>
    api.patch<JewelProduct>(API_ENDPOINTS.jewelProducts.toArchive(id)),

  /**
   * Publish jewel product
   */
  publishJewelProduct: (id: string) =>
    api.patch<JewelProduct>(API_ENDPOINTS.jewelProducts.toPublish(id)),

  /**
   * Delete jewel product
   */
  deleteJewelProduct: (id: string) =>
    api.delete<void>(API_ENDPOINTS.jewelProducts.delete(id)),

  /**
   * Get paginated list of stock items for a product
   */
  getStockItemsList: (productId: string, params?: PaginationParams) =>
    api.get<PaginatedResponse<StockItem>>(
      API_ENDPOINTS.stockManagement.list(productId),
      { params }
    ),

  /**
   * Create new stock item for a product
   */
  createStockItem: (productId: string, data: StockItemUpsertPayload) =>
    api.post<StockItem>(API_ENDPOINTS.stockManagement.create(productId), data),

  /**
   * Update existing stock item
   */
  updateStockItem: (productId: string, stockId: string, data: StockItemUpsertPayload) =>
    api.put<StockItem>(API_ENDPOINTS.stockManagement.update(productId, stockId), data),

  changeStockStatus: (id: string, data: any) =>
    api.patch<StockItem>(API_ENDPOINTS.stockManagement.changeStatus(id), { data }),
  /**
   * Delete stock item
   */
  deleteStockItem: (productId: string, stockId: string) =>
    api.delete<void>(API_ENDPOINTS.stockManagement.delete(productId, stockId)),
};
