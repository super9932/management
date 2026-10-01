import type { PromptSearchScope, UseYn } from '../types';

/**
 * POST /v1/get/customer/admin/touch/message/prompt/list — 프롬프트 목록 조회
 *
 * 등록일 기간·카테고리·항목·사용여부·검색어로 거른 목록. 본문 전문은 싣지 않고 길이만 내린다.
 */

export interface PromptListRequest {
  /** 등록일 시작(yyyy-MM-dd, 미지정 = 제한 없음) */
  startDate?: string;
  /** 등록일 종료(yyyy-MM-dd, 해당일 포함, 미지정 = 제한 없음) */
  endDate?: string;
  /** 카테고리 필터(1-depth 코드, 미지정 = 전체) */
  category?: string;
  /** 항목 필터(2-depth, 미지정 = 전체) */
  item?: string;
  /** 검색어 적용 범위 (미지정 = ALL). MODIFIER 는 사번이 아니라 이름으로 검색한다 */
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
  /** 프롬프트ID */
  id: number;
  /** 카테고리 코드(1-depth) */
  category: string;
  /** 카테고리 표기 */
  categoryLabel: string;
  /** 항목 코드(2-depth) — 시나리오 계열은 common|guideline|validation, 그 외는 선택값 라벨 */
  item: string;
  /** 프롬프트명 */
  name: string;
  /** 본문 길이(문자) */
  contentLength: number;
  /** 프롬프트 해시(sha256 hex) */
  hash: string;
  /** 등록일시(yyyy-MM-dd HH:mm:ss) */
  registeredAt: string;
  /** 수정일시(yyyy-MM-dd HH:mm:ss) */
  updatedAt: string;
  /** 최종 수정자 사번 */
  lastChangerEmnb: string;
  /** 최종 수정자 '이름(사번)' — 이름은 저장하지 않고 매 조회 시 코어에서 해석한다. 해석 실패 시 사번만 */
  lastChanger: string;
  /** 사용여부 */
  useYn: UseYn;
}

export interface PromptListResponse {
  prompts: PromptItem[];
  /** 조건에 맞는 전체 건수 */
  totalCount: number;
  /** 요청 페이지 번호(1-base) */
  page: number;
  /** 요청 페이지 크기 */
  size: number;
}
