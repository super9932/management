import type { MutationResponse, UseYn } from '../types';

/**
 * POST /v1/post/customer/admin/touch/message/prompt — 프롬프트 등록
 *
 * 사전 정의된 29개 슬롯 중 **비어 있는 것을 채우는** 동작이다.
 * (category, item) 조합이 곧 슬롯이라 이미 등록된 슬롯이면 409, 카탈로그 밖 조합은 400.
 *
 * 요청자(변경자) 사번 `emnb` 는 스웨거상 필수 본문 필드지만 이 타입에는 두지 않는다 —
 * service(createPrompt)가 두 번째 인자로 받아 withEmnb 로 본문에 얹는다.
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
