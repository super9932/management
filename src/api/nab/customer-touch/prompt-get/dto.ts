import type { PromptThresholds, UseYn } from '../types';

/** POST /v1/get/customer/admin/touch/message/prompt — 프롬프트 단건 조회 */

export interface PromptGetRequest {
  /** 프롬프트ID */
  id: number;
}

export interface PromptGetResponse {
  id: number;
  /** 유형 */
  type: string;
  /** 카테고리 */
  category: string;
  /** 프롬프트명 */
  name: string;
  /** 프롬프트 본문 전문 */
  content: string;
  /** message_style 전용 — 본문에서 잘라낸 [특징]. 실제 생성 호출에는 이 부분만 전달된다. */
  characteristic: string;
  /** message_style 전용 — 본문에서 잘라낸 [예시]. 관리 화면 미리보기용이며 생성 호출에 전달되지 않는다. */
  example: string;
  /** 프롬프트 해시(sha256 hex) */
  hash: string;
  /** 검증 지표 하한선(validation 유형 전용) */
  thresholds: PromptThresholds;
  /** 검증 최대반복 횟수(validation 유형 전용) */
  maxIterations: number;
  registeredAt: string;
  updatedAt: string;
  /** 최종 수정자 사번 */
  lastChangerEmnb: string;
  /** 최종 수정자 '이름(사번)' — 매 조회 시 코어에서 해석, 실패 시 사번만 */
  lastChanger: string;
  useYn: UseYn;
}
