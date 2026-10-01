import type { MutationResponse } from '../types';

/**
 * POST /v1/post/customer/admin/touch/message/prompt/delete — 프롬프트 삭제
 *
 * 소프트 삭제(DEL_YN='Y'). **카탈로그 29종은 삭제할 수 없다(409)** — 사용여부(useYn)로 끈다.
 * 요청자(변경자) 사번 `emnb` 는 스웨거상 필수 본문 필드로, service(deletePrompt)가 withEmnb 로 얹는다.
 */

export interface PromptDeleteRequest {
  /** 프롬프트ID */
  id: number;
}

/** id = 삭제된 프롬프트ID */
export type PromptDeleteResponse = MutationResponse;
