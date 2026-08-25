import type { Pagination } from '../types';

/**
 * POST /v1/get/customer/admin/touch/stats/messages — 메시지 생성 로그 raw 조회
 *
 * 요약(summary)과 달리 생성내역 원본 행을 그대로 내려주므로 고객ID·메시지 본문 같은
 * 개인정보가 포함된다.
 */
export interface StatsMessagesRequest {
  /** 조회 시작일(yyyy-MM-dd, 양끝 포함) */
  from: string;
  /** 조회 종료일(yyyy-MM-dd, 양끝 포함) */
  to: string;
  /** 페이지 번호(1-base) */
  pageNum: number;
  /** 페이지 크기(1~500) */
  pageSize: number;
}

/** 메시지 생성 유형 — CREATE=최초 생성, EDIT=수정(재생성) */
export type MessageGenerationType = 'CREATE' | 'EDIT';

export interface MessageRow {
  /** 메시지 생성 로그ID */
  msgeGnrtId: number;
  /** FP고유번호(생성 요청자) */
  fpUniqNo: string;
  /** 고객ID */
  custId: string;
  /** 진입점 코드 */
  entryPointCode: string;
  /** 생성 유형 — CREATE / EDIT */
  generationTypeCode: MessageGenerationType;
  /** 직전 생성 로그ID — 최초 생성이면 null */
  prevMsgeGnrtId: number | null;
  /** 콘텐츠ID — 콘텐츠 기반 생성이 아니면 null */
  cuosCntsId: number | null;
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
