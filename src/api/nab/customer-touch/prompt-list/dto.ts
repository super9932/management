import type { UseYn } from '../types';

/** POST /v1/get/customer/admin/touch/message/prompt/list — 프롬프트 목록 조회 */

export interface PromptListRequest {
  /** 카테고리 코드 필터 (미지정 = 전체) */
  categoryCode?: string;
  /** 사용여부 필터 (미지정 = 전체) */
  useYn?: UseYn;
}

/** 목록 행 — 단건 조회(PromptGetResponse)와 달리 extraGuide가 없다 */
export interface PromptItem {
  id: number;
  name: string;
  categoryCode: string;
  toneCode: string;
  situationCode: string;
  relationshipCode: string;
  interestCode: string;
  updatedAt: string;
  useYn: UseYn;
}

export interface PromptListResponse {
  prompts: PromptItem[];
}
