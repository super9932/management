import type { MutationResponse, UseYn } from '../types';

/**
 * POST /v1/post/customer/admin/touch/content/category/update — 카테고리 수정
 *
 * ⚠️ 스웨거 스키마 충돌: 프롬프트 수정과 `UpdateRequest` 이름을 공유해 프롬프트 필드로
 * 덮어써져 있다. 아래는 CategoryResponse + UseYnRequest 기준 추론 — BE 확인 필요.
 * (식별자가 cgryCode인지 별도 숫자 id인지도 확인 대상)
 */
export interface CategoryUpdateRequest {
  /** 수정 대상 카테고리 코드 */
  cgryCode: string;
  cgryNm: string;
  cntn?: string;
  sortOrdr?: number;
  useYn: UseYn;
  prgmId?: string;
}

export type CategoryUpdateResponse = MutationResponse;
