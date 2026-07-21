/** POST /v1/post/customer/admin/touch/stats/aggregate — 통계 수동 재집계 */

export interface StatsAggregateRequest {
  /** 재집계 시작일 (미지정 시 최근 N일) */
  from?: string;
  /** 재집계 종료일 (미지정 시 오늘) */
  to?: string;
}

export interface StatsAggregateResponse {
  /** 재집계 시작일 */
  from: string;
  /** 재집계 종료일 */
  to: string;
}
