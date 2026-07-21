// 프롬프트 관리
export interface PromptRow {
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
export interface ServiceToggleItem {
  key: string;
  label: string;
  helper: string;
}

export type ServiceToggleState = Record<string, boolean>;

// 통계
export interface StatRow {
  date: string;
  /** STAT_GROUPS.length × metrics.length 길이의 셀 값 */
  cells: string[];
}
