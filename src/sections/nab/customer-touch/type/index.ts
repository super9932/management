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
export interface StatRow {
  date: string;
  /** STAT_GROUPS.length × metrics.length 길이의 셀 값 */
  cells: string[];
}
