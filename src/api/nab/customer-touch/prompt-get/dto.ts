import type { UseYn } from '../types';

/** POST /v1/get/customer/admin/touch/message/prompt — 프롬프트 단건 조회 */

export interface PromptGetRequest {
  /** 프롬프트ID */
  id: number;
}

export interface PromptGetResponse {
  id: number;
  name: string;
  categoryCode: string;
  toneCode: string;
  situationCode: string;
  relationshipCode: string;
  interestCode: string;
  /** 추가 가이드 — 목록 응답에는 없고 단건 조회에만 포함된다 */
  extraGuide: string;
  updatedAt: string;
  useYn: UseYn;
}
