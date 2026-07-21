import type { MutationResponse } from '../types';

/** POST /v1/post/customer/admin/touch/message/prompt — 프롬프트 등록 */

export interface PromptCreateRequest {
  name: string;
  categoryCode: string;
  toneCode: string;
  situationCode: string;
  relationshipCode: string;
  interestCode: string;
  /** 추가 가이드(선택) */
  extraGuide?: string;
}

/** id = 생성된 프롬프트ID */
export type PromptCreateResponse = MutationResponse;
