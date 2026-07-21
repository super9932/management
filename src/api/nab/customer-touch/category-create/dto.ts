import type { MutationResponse, UseYn } from '../types';

/**
 * POST /v1/post/customer/admin/touch/content/category — 카테고리 등록
 *
 * ⚠️ 스웨거 스키마 충돌: 이 API의 요청 스키마가 프롬프트 등록과 동일한 `CreateRequest`
 * 이름으로 등록돼 프롬프트 필드(name/toneCode/…)로 덮어써져 있다.
 * 아래 필드는 CategoryResponse + UseYnRequest 기준으로 추론한 것 — BE 확인 필요.
 */
export interface CategoryCreateRequest {
  /** 카테고리 코드 */
  cgryCode: string;
  /** 카테고리명 */
  cgryNm: string;
  /** 설명 */
  cntn?: string;
  /** 정렬순서 (오름차순) */
  sortOrdr?: number;
  useYn: UseYn;
  /** 프로그램ID (UseYnRequest와 동일하게 감사 로그용으로 추정) */
  prgmId?: string;
}

export type CategoryCreateResponse = MutationResponse;
