import type { StatsFpType } from '../types';

/**
 * POST /v1/post/customer/admin/touch/stats/search/excel — AI 콘텐츠 검색 통계 엑셀 다운로드
 *
 * 목록과 같은 필터로 조회기간 전건을 내려받는다(페이징 없음).
 */
export interface StatsSearchExcelRequest {
  /** 조회 시작일(yyyy-MM-dd, 해당일 포함) */
  from: string;
  /** 조회 종료일(yyyy-MM-dd, 해당일 포함) */
  to: string;
  /** FP 유형(미지정 = ALL) */
  fpType?: StatsFpType;
}

/** 응답은 xlsx 바이너리(Blob) — 엔벨로프 없음 */
export type StatsSearchExcelResponse = Blob;
