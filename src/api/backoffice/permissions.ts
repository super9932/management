/**
 * §08 백오피스 · 권한 관리 — No.32~35
 */
import { fetcher, fetcherWithParams, postFetcher } from '../fetcher';
import type {
  UserListResponse,
  RoleItem,
  SettingCategory,
  SettingUpdateResult,
  RoleCode,
} from '../types';

// No.32 — 사용자 조회
export interface GetUsersParams {
  roleCode?: RoleCode;
  keyword?: string;
  page?: number;
  limit?: number;
}

export const getUsers = (params?: GetUsersParams) =>
  fetcherWithParams<UserListResponse>(
    '/bo/v1/get/admin/users',
    params ?? {}
  );

// No.33 — 권한 목록 (5종)
export const getRoles = () =>
  fetcher<RoleItem[]>('/bo/v1/get/admin/roles');

// No.34 — 시스템 설정 조회
export const getSettings = () =>
  fetcher<SettingCategory[]>('/bo/v1/get/admin/settings');

// No.35 — 시스템 설정 변경
export interface SettingUpdate {
  key: string;
  value: string;
  changeReason?: string;
}

export const updateSettings = (updates: SettingUpdate[]) =>
  postFetcher<SettingUpdateResult>(
    '/bo/v1/post/admin/settings',
    { updates }
  );
