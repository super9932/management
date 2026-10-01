import type { UseYn } from '../types';

/**
 * POST /v1/get/customer/admin/touch/message/prompt — 프롬프트 단건 조회
 *
 * 본문 전문 포함. message_style 은 [특징]/[예시]를 분리해 함께 내린다.
 * 삭제된 행(DEL_YN='Y')은 없는 것으로 보아 404다.
 */
export interface PromptGetRequest {
  /** 프롬프트ID */
  id: number;
}

export interface PromptGetResponse {
  /** 프롬프트ID */
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
  /** message_style 전용 — 본문에서 잘라낸 [예시]. 관리 화면 미리보기용이며 생성 호출에 절대 전달되지 않는다. 다른 유형은 null. */
  example: string | null;
  /** 프롬프트 해시(sha256 hex) */
  hash: string;
  /** 등록일시(yyyy-MM-dd HH:mm:ss) */
  registeredAt: string;
  /** 수정일시(yyyy-MM-dd HH:mm:ss) */
  updatedAt: string;
  /** 최종 수정자 사번 */
  lastChangerEmnb: string;
  /** 최종 수정자 '이름(사번)' */
  lastChanger: string;
  /** 사용여부 */
  useYn: UseYn;
}
