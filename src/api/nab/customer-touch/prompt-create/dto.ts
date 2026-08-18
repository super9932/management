import type { MutationResponse, PromptThresholds, UseYn } from '../types';

/** POST /v1/post/customer/admin/touch/message/prompt — 프롬프트 등록 */

export interface PromptCreateRequest {
  /** 프롬프트명 */
  name: string;
  /** 유형 */
  type: string;
  /** 카테고리 — common/validation/send_validation/guideline 은 '일반'|'콘텐츠', 그 외 유형은 선택값 라벨 */
  category: string;
  /** 프롬프트 본문. message_style 은 [특징]/[예시] 두 섹션을 함께 담는다. */
  content: string;
  /** 사용여부(미지정 = Y) */
  useYn?: UseYn;
  /** 검증 지표 하한선(validation 유형 전용, 0~5) */
  thresholds?: PromptThresholds;
  /** 검증 최대반복 횟수(validation 유형 전용, 1 이상) */
  maxIterations?: number;
}

/** id = 생성된 프롬프트ID */
export type PromptCreateResponse = MutationResponse;
