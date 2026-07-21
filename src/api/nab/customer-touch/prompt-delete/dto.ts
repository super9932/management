import type { MutationResponse } from '../types';

/** POST /v1/post/customer/admin/touch/message/prompt/delete — 프롬프트 삭제 */

export interface PromptDeleteRequest {
  /** 프롬프트ID */
  id: number;
}

/** id = 삭제된 프롬프트ID */
export type PromptDeleteResponse = MutationResponse;
