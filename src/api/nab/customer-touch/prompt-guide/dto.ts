/** POST /v1/get/customer/admin/touch/message/prompt/guide — 프롬프트 작성 가이드 조회 */

/** 요청 body 없음 (단일 글로벌 가이드) */
export type PromptGuideRequest = void;

export interface PromptGuideResponse {
  /** 글로벌 작성 가이드 본문 */
  guide: string;
}
