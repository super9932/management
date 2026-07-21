/** POST /v1/get/customer/admin/touch/stats/summary — 통계 요약 조회 */

export interface StatsSummaryRequest {
  /** 조회 시작일 */
  from: string;
  /** 조회 종료일 */
  to: string;
}

export interface StatsSummaryResponse {
  /** 메시지 생성 건수 */
  generateCount: number;
  /** 발송 건수 */
  sendCount: number;
  /** 열람 건수 */
  readCount: number;
  /** 검색 건수 */
  searchCount: number;
  /** 고객 수 */
  customerCount: number;
}
