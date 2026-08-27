/**
 * POST /v1/post/customer/admin/touch/stats/recompute — 통계 강제 재집계
 *
 * 지정 구간의 **확정 저장을 지우기만 한다.** 값은 다음 조회(daily)가 다시 계산한다.
 * 배치가 아니라 운영 복구용 — 집계 로직이 바뀌거나 FP유형 사번 판정이 도입되면
 * 과거 구간을 되살릴 방법이 이것뿐이다.
 *
 * 기존 stats/aggregate(수동 재집계)와는 다른 API다.
 */
export interface StatsRecomputeRequest {
  /** 재집계 시작일(yyyy-MM-dd, 해당일 포함) */
  from: string;
  /** 재집계 종료일(yyyy-MM-dd, 해당일 포함) */
  to: string;
  /** true = 메시지 큐브 재집계 (미지정 = true) */
  message?: boolean;
  /** true = 검색 큐브 재집계 (미지정 = true) */
  search?: boolean;
}

export interface StatsRecomputeResponse {
  /** 재집계 시작일 */
  from: string;
  /** 재집계 종료일 */
  to: string;
  /** 삭제한 메시지 집계행 수 */
  deletedMessageRows: number;
  /** 삭제한 검색 집계행 수 */
  deletedSearchRows: number;
}
