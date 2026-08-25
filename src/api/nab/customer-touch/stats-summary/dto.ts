/** POST /v1/get/customer/admin/touch/stats/summary — 통계 요약 조회 */

export interface StatsSummaryRequest {
  /** 조회 시작일 */
  from: string;
  /** 조회 종료일 */
  to: string;
}

export interface StatsSummaryResponse {
  /** 메시지 생성 건수(최초 생성만 — 수정 제외) */
  generateCount: number;
  /** 메시지 수정 건수(재생성 포함) */
  editCount: number;
  /** 발송 건수 */
  sendCount: number;
  /** 열람 건수 */
  readCount: number;
  /** 검색 건수 */
  searchCount: number;
  /** 고객 수 */
  customerCount: number;
}
