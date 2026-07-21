/** POST /v1/get/customer/admin/touch/message/prompt/duplicate — 프롬프트 코드조합 중복 확인 */

export interface PromptDuplicateRequest {
  categoryCode: string;
  toneCode: string;
  situationCode: string;
  relationshipCode: string;
  interestCode: string;
  /** 중복판정에서 제외할 자기 자신 ID (수정 시) */
  excludeId?: number;
}

export interface PromptDuplicateResponse {
  /** 동일 코드조합 프롬프트 존재 여부 (true = 중복) */
  duplicate: boolean;
}
