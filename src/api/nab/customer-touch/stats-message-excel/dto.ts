import type { StatsEntryPoint, StatsFpType, StatsGenerationMethod } from '../types';

/**
 * POST /v1/post/customer/admin/touch/stats/message/excel — AI 메시지 생성 통계 엑셀 다운로드
 *
 * 목록과 같은 필터로 조회기간 전건을 내려받는다(페이징 없음).
 */
export interface StatsMessageExcelRequest {
  /** 조회 시작일(yyyy-MM-dd, 해당일 포함) */
  from: string;
  /** 조회 종료일(yyyy-MM-dd, 해당일 포함) */
  to: string;
  /** 메시지 생성 기준(진입점, 미지정 = ALL) */
  entryPoint?: StatsEntryPoint;
  /** 메시지 생성 유형(생성방식, 미지정 = ALL) */
  generationMethod?: StatsGenerationMethod;
  /** FP 유형(미지정 = ALL) */
  fpType?: StatsFpType;
}

/** 응답은 xlsx 바이너리(Blob) — 엔벨로프 없음 */
export type StatsMessageExcelResponse = Blob;
