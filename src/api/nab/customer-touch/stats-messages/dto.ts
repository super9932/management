import type { Pagination } from '../types';

/** POST /v1/get/customer/admin/touch/stats/messages — 메시지 생성 로그 raw 조회 */

export interface StatsMessagesRequest {
  /** 조회 시작일 */
  from: string;
  /** 조회 종료일 */
  to: string;
  /** 페이지 번호(1-base) — 스펙상 string */
  pageNum: string;
  /** 페이지 크기 — 스펙상 string */
  pageSize: string;
}

export interface MessageRow {
  /** FP고유번호(생성 요청자) */
  fpUniqNo: string;
  /** 고객ID */
  custId: string;
  /** 콘텐츠ID */
  cuosCntsId: number;
  /** 생성 적용 옵션 — 어조 */
  toneCode: string;
  /** 생성 적용 옵션 — 상황 */
  situationCode: string;
  /** 생성 적용 옵션 — 관계 */
  relationshipCode: string;
  /** 생성 적용 옵션 — 관심사 */
  interestCode: string;
  /** 생성 메시지 본문(답변) */
  msgeCntn: string;
  /** 생성일시 */
  gnrtDttm: string;
}

export interface StatsMessagesResponse {
  pagination: Pagination;
  list: MessageRow[];
}
