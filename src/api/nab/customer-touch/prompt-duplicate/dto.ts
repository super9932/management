/** POST /v1/get/customer/admin/touch/message/prompt/duplicate — 프롬프트 코드조합 중복 확인 */

export interface PromptDuplicateRequest {
  /** 유형 */
  type: string;
  /** 카테고리 */
  category: string;
  /** 중복판정에서 제외할 자기 자신 ID (수정 시) */
  excludeId?: number;
}

export interface PromptDuplicateResponse {
  /** 동일 (유형, 카테고리) 프롬프트 존재 여부 (true = 중복, bo-02_8 팝업) */
  duplicate: boolean;
}
