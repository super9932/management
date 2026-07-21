/** POST /v1/post/customer/admin/touch/stats/excel — 생성 로그 엑셀 다운로드 */

export interface StatsExcelRequest {
  /** 조회 시작일 */
  from: string;
  /** 조회 종료일 */
  to: string;
}

/** 응답은 xlsx 바이너리(Blob) — 엔벨로프 없음 */
export type StatsExcelResponse = Blob;
