import type { MutationResponse, PromptThresholds, UseYn } from '../types';

/** POST /v1/post/customer/admin/touch/message/prompt/update — 프롬프트 수정 */

export interface PromptUpdateRequest {
  /** 프롬프트ID */
  id: number;
  /** 프롬프트명 */
  name: string;
  /** 유형 */
  type: string;
  /** 카테고리 */
  category: string;
  /** 프롬프트 본문 */
  content: string;
  /** 사용여부(미지정 = Y) */
  useYn?: UseYn;
  /** 검증 지표 하한선(validation 유형 전용, 0~5) */
  thresholds?: PromptThresholds;
  /** 검증 최대반복 횟수(validation 유형 전용, 1 이상) */
  maxIterations?: number;
}

/** id = 수정된 프롬프트ID */
export type PromptUpdateResponse = MutationResponse;
