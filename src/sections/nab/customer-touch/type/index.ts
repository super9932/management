// 프롬프트 관리
export interface PromptRow {
  /** 프롬프트ID — 행 key 및 단건 조회에 쓴다 */
  id: number;
  /** 목록에서의 표시 번호 (전체 건수 기준 내림차순) */
  no: number;
  contentsId: string;
  type: string;
  category: string;
  promptName: string;
  registeredAt: string;
  updatedAt: string;
  lastEditor: string;
}

// 서비스 관리
/** Kill-Switch 기능코드 — 토글 on/off 판정 기준 */
export type ServiceFeatureCode =
  | 'AI_MESSAGE_GENERATION'
  | 'AI_CONTENT_SEARCH'
  | 'AI_CUSTOMER_RECOMMEND';

export interface ServiceToggleItem {
  key: ServiceFeatureCode;
  label: string;
  helper: string;
}

export type ServiceToggleState = Record<ServiceFeatureCode, boolean>;

// 통계
/** AI 메시지 생성 통계 표의 한 행 — 지표가 API 응답 필드와 1:1이다 */
export interface MessageStatRow {
  /** 일자 (yyyy-MM-dd) */
  date: string;
  /** 접속 FP수(UV) */
  fpUv: string;
  /** 메시지 생성 건수 */
  generate: string;
  /** 메시지 수정 건수 */
  modify: string;
  /** 메시지 발송 건수 */
  send: string;
  /** 발송 고객 수(UV) */
  sendCustomerUv: string;
}

/** AI 콘텐츠 검색 통계 표의 한 행 */
export interface ContentSearchStatRow {
  /** 일자 (yyyy-MM-dd) */
  date: string;
  /** 접속 FP수(UV) */
  fpUv: string;
  /** 검색 실행 수 */
  search: string;
}
