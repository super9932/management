/**
 * 고객터치AI 관리자 API 공용 타입
 * swagger: [NAB] NEXTLAB AI 비즈니스 서비스 API — 01. 고객AI
 */

// ── 응답 엔벨로프 ────────────────────────────────────────────────────────────

export interface ApiError {
  code?: string;
  message?: string;
  details?: unknown[];
}

export interface PageInfo {
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

export interface ResponseMeta {
  version?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: ApiError;
  requestedAt?: string;
  respondedAt?: string;
  elapsedTime?: number;
  page?: PageInfo;
  meta?: ResponseMeta;
}

// ── 공통 모델 ────────────────────────────────────────────────────────────────

/** 목록 API 페이지네이션 (fleet 표준 규약, pageNum은 1-base) */
export interface Pagination {
  /** 현재 페이지 번호 */
  pageNum: number;
  /** 한 페이지에 표시될 아이템 수 */
  pageSize: number;
  /** 전체 아이템 개수 */
  totalElements: number;
  /** 전체 페이지 개수 */
  totalPages: number;
  prev: boolean;
  next: boolean;
  /** 표시될 페이지네이션 개수 — 응답에 따라 생략된다 */
  pageNumbersToShow?: number;
  /** 페이지네이션 시작번호 — 응답에 따라 생략된다 */
  startPage?: number;
  /** 페이지네이션 종료번호 — 응답에 따라 생략된다 */
  endPage?: number;
  /** 이전 블럭 페이지 번호 — 응답에 따라 생략된다 */
  prevPage?: number;
  /** 다음 블럭 페이지 번호 — 응답에 따라 생략된다 */
  nextPage?: number;
}

/** 등록/수정/삭제 API 공통 응답 — 대상 리소스 ID */
export interface MutationResponse {
  id: number;
}

export type UseYn = 'Y' | 'N';

export type KillSwitchState = 'ENABLED' | 'DISABLED';

/** killswitch save/list/detail 공용 */
export interface KillSwitchItem {
  featureCode: string;
  featureName: string;
  state: KillSwitchState;
  description: string;
  updatedBy: string;
  updatedAt: string;
  createdAt: string;
}

/** 프롬프트 목록 검색어 적용 범위 (미지정 = ALL) */
export type PromptSearchScope = 'ALL' | 'NAME' | 'MODIFIER';

/** NAH 콘텐츠 색인 상태 — description 비동기 생성 진행 상태 */
export type ContentStatus = 'processing' | 'created' | 'updating' | 'updated';

/** NAH 콘텐츠 키워드 쌍 */
export interface KeywordPairItem {
  category: string;
  name: string;
}

/** NAH 콘텐츠 등록/수정 공통 응답 */
export interface ContentWriteResult {
  contentId: string;
  ok: boolean;
  contentStatus: ContentStatus;
}
