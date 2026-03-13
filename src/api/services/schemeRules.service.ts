import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  schemeRule,
  PaginatedResponse,
  PaginationParams,
  SchemeRuleRequest,
} from '@/types';

export const schemeRulesService = {
  getAllSchemeRules: (params?: PaginationParams) =>
    api.get<PaginatedResponse<schemeRule>>(API_ENDPOINTS.schemeRules.list, { params }),

  createSchemeRule: (data: SchemeRuleRequest) =>
    api.post<SchemeRuleRequest>(API_ENDPOINTS.schemeRules.create, data),

  updateSchemeRule: (id: string, data: Partial<SchemeRuleRequest>) =>
    api.put<SchemeRuleRequest>(API_ENDPOINTS.schemeRules.update(id as string), data),

  getSchemeRuleById: (id: string) =>
    api.get<SchemeRuleRequest>(API_ENDPOINTS.schemeRules.detail(id as string)),

  updateSchemeStatus: (id: string, data: Partial<SchemeRuleRequest>) =>
    api.patch<SchemeRuleRequest>(API_ENDPOINTS.schemeRules.updateStatus(id as string), data),

  deleteSchemeRule: (id: string) =>
    api.delete<SchemeRuleRequest>(API_ENDPOINTS.schemeRules.delete(id as string)),
}