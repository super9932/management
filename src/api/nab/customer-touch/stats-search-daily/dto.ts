import type { Pagination, StatsFpType, StatsPageSize } from '../types';

/**
 * POST /v1/get/customer/admin/touch/stats/search/daily — AI 콘텐츠 검색 통계 (일자별)
 *
 * 총 건수·집계 상한선·확정 저장 규칙은 메시지 탭과 동일하다.
 * 필터는 공통 축(기간·FP유형)만 있다.
 */
export interface StatsSearchDailyRequest {
  /** 조회 시작일(yyyy-MM-dd, 해당일 포함) */
  from: string;
  /** 조회 종료일(yyyy-MM-dd, 해당일 포함). from~to 최대 366일 */
  to: string;
  /** FP 유형(미지정 = ALL) */
  fpType?: StatsFpType;
  /** 페이지 번호(1-base, 미지정 = 1) */
  pageNum?: number;
  /** 페이지 크기(미지정 = 10). 10/30/50/70/100 외 값은 400 */
  pageSize?: StatsPageSize;
}

/** 일자별 검색 집계 한 행 */
export interface SearchStatsRow {
  /** 일자(yyyy-MM-dd) */
  statDate: string;
  /** 접속 FP수(UV) — 그날 검색을 실행한 FP 수(중복 제외) */
  fpUvCount: number;
  /**
   * 검색 실행 수 — 검색을 누른 횟수. 같은 FP 가 같은 키워드를 10번 검색하면 10건이다.
   * 최근검색어(15행 제한 + 삭제 API)와는 원천이 달라 값이 서로 맞지 않는다.
   */
  searchCount: number;
}

/** 메시지 탭과 동일한 Page 래퍼다 — 엔벨로프 `page` 가 아니라 data 안에 pagination 이 있다 */
export interface StatsSearchDailyResponse {
  pagination: Pagination;
  list: SearchStatsRow[];
}
