/**
 * User API service
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  User,
  UpdateProfileRequest,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export const userService = {
  /**
   * Get paginated list of users
   */
  getUsers: (params?: PaginationParams) =>
    api.get<PaginatedResponse<User>>(API_ENDPOINTS.users.list, { params }),

  /**
   * Get user by ID
   */
  getUserById: (id: string) =>
    api.get<User>(API_ENDPOINTS.users.detail(id)),

  /**
   * Create new user (admin)
   */
  createUser: (data: Partial<User>) =>
    api.post<User>(API_ENDPOINTS.users.create, data),

  /**
   * Update user
   */
  updateUser: (id: string, data: Partial<User>) =>
    api.put<User>(API_ENDPOINTS.users.update(id), data),

  /**
   * Delete user
   */
  deleteUser: (id: string) =>
    api.delete<void>(API_ENDPOINTS.users.delete(id)),

  /**
   * Get current user profile
   */
  getProfile: () =>
    api.get<User>(API_ENDPOINTS.users.profile),

  /**
   * Update current user profile
   */
  updateProfile: (data: UpdateProfileRequest) =>
    api.patch<User>(API_ENDPOINTS.users.updateProfile, data),
};
