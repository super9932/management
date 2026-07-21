import type { MutationResponse, UseYn } from '../types';

/** POST /v1/post/customer/admin/touch/content/category/useYn — 카테고리 사용여부 토글 */

export interface CategoryUseYnRequest {
  cgryCode: string;
  useYn: UseYn;
  /** 프로그램ID */
  prgmId?: string;
}

export type CategoryUseYnResponse = MutationResponse;
