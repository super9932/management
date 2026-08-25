import type { MutationResponse, UseYn } from '../types';

/**
 * POST /v1/post/customer/admin/touch/message/prompt — 프롬프트 등록
 *
 * (category, item) 조합이 곧 슬롯이라 이미 등록된 슬롯이면 409.
 * 등록자 사번은 바디로 받지 않고 토큰(subject)에서 채운다.
 */
export interface PromptCreateRequest {
  /** 프롬프트명 */
  name: string;
  /** 카테고리(1-depth) — general|content|situation|relationship|tone|message_style */
  category: string;
  /** 항목(2-depth) — general/content는 common|guideline|validation, 그 외는 선택값 라벨 */
  item: string;
  /** 프롬프트 본문. message_style 은 [특징]/[예시] 두 섹션을 함께 담는다. */
  content: string;
  /** 사용여부(미지정 = Y) */
  useYn?: UseYn;
}

/** id = 생성된 프롬프트ID */
export type PromptCreateResponse = MutationResponse;
