import type { MutationResponse } from '../types';

/** POST /v1/post/customer/admin/touch/message/prompt/update — 프롬프트 수정 */

export interface PromptUpdateRequest {
  id: number;
  name: string;
  categoryCode: string;
  toneCode: string;
  situationCode: string;
  relationshipCode: string;
  interestCode: string;
  /** 추가 가이드(선택) */
  extraGuide?: string;
}

/** id = 수정된 프롬프트ID */
export type PromptUpdateResponse = MutationResponse;
