import type { UseYn } from '../types';

/**
 * POST /v1/get/customer/admin/touch/message/prompt — 프롬프트 단건 조회
 *
 * 삭제된 행(DEL_YN='Y')은 없는 것으로 보아 404다.
 *
 * ⚠️ 스웨거 스키마 충돌: 요청 스키마가 NAH 콘텐츠 단건조회와 `GetRequest` 이름을 공유해
 * Schema 탭에는 `contentId`로 표시된다. 이 API의 실제 본문은 Examples(`{"id": 118}`)대로 id다.
 */
export interface PromptGetRequest {
  /** 프롬프트ID */
  id: number;
}

export interface PromptGetResponse {
  id: number;
  /** 카테고리 코드(1-depth) */
  category: string;
  /** 카테고리 표기 */
  categoryLabel: string;
  /** 항목 코드(2-depth) */
  item: string;
  /** 프롬프트명 */
  name: string;
  /** 프롬프트 본문 전문 */
  content: string;
  /** message_style 전용 — 본문에서 잘라낸 [특징]. 실제 생성 호출에는 이 부분만 전달된다. 다른 유형은 null. */
  characteristic: string | null;
  /** message_style 전용 — 본문에서 잘라낸 [예시]. 관리 화면 미리보기 전용. 다른 유형은 null. */
  example: string | null;
  /** 프롬프트 해시(sha256 hex) */
  hash: string;
  registeredAt: string;
  updatedAt: string;
  /** 최종 수정자 사번 */
  lastChangerEmnb: string;
  /** 최종 수정자 '이름(사번)' */
  lastChanger: string;
  useYn: UseYn;
}
