import type { PromptSearchScope, UseYn } from '../types';

/** POST /v1/get/customer/admin/touch/message/prompt/list — 프롬프트 목록 조회 */

export interface PromptListRequest {
  /** 등록일 시작(yyyy-MM-dd, 미지정 = 제한 없음) */
  startDate?: string;
  /** 등록일 종료(yyyy-MM-dd, 해당일 포함, 미지정 = 제한 없음) */
  endDate?: string;
  /** 유형 필터 (미지정 = 전체) */
  type?: string;
  /** 카테고리 필터 (미지정 = 전체) */
  category?: string;
  /** 검색어 적용 범위 (미지정 = ALL) */
  searchScope?: PromptSearchScope;
  /** 검색어 (미지정 = 검색 안 함) */
  keyword?: string;
  /** 사용여부 필터 (미지정 = 전체) */
  useYn?: UseYn;
  /** 페이지 번호(1부터, 미지정 = 1) */
  page?: number;
  /** 페이지 크기(미지정 = 20, 최대 100) */
  size?: number;
}

/** 목록 행 — 단건 조회(PromptGetResponse)와 달리 본문은 길이만 내려온다 */
export interface PromptItem {
  id: number;
  /** 유형 */
  type: string;
  /** 카테고리 */
  category: string;
  /** 프롬프트명 */
  name: string;
  /** 본문 길이(문자) */
  contentLength: number;
  /** 프롬프트 해시(sha256 hex) */
  hash: string;
  registeredAt: string;
  updatedAt: string;
  /** 최종 수정자 사번 */
  lastChangerEmnb: string;
  /** 최종 수정자 '이름(사번)' — 매 조회 시 코어에서 해석, 실패 시 사번만 */
  lastChanger: string;
  useYn: UseYn;
}

export interface PromptListResponse {
  prompts: PromptItem[];
  /** 조건에 맞는 전체 건수 */
  totalCount: number;
  page: number;
  size: number;
}
