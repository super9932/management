/** POST /v1/get/customer/admin/touch/message/prompt/duplicate — 프롬프트 조합 중복 확인 */

export interface PromptDuplicateRequest {
  /** 카테고리(1-depth) */
  category: string;
  /** 항목(2-depth) */
  item: string;
  /** 중복판정에서 제외할 자기 자신 ID (수정 시) */
  excludeId?: number;
}

export interface PromptDuplicateResponse {
  /** 동일 (카테고리, 항목) 슬롯 존재 여부 (true = 중복) */
  duplicate: boolean;
}
