/**
 * 고객터치AI 관리자 API 공용 타입
 * swagger: [NAB] NEXTLAB AI 비즈니스 서비스 API — 01. 고객AI
 */

// ── 응답 엔벨로프 ────────────────────────────────────────────────────────────

/**
 * 검증 실패 상세 한 건.
 * error.message 는 ' 요청 값이 올바르지 않습니다.' 처럼 공통 문구라 실제 원인은 여기에만 있다
 * (스테이징 확인: emnb 누락 → details[0] = { field: 'emnb', message: '사번은(는) 필수입니다.' }).
 */
export interface ApiErrorDetail {
  /** 문제가 된 요청 필드명 */
  field?: string;
  /** 사용자에게 보여줄 수 있는 사유 */
  message?: string;
}

export interface ApiError {
  code?: string;
  message?: string;
  details?: ApiErrorDetail[];
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
  /** 시작 오프셋 — 스웨거 스키마에는 없으나 실제 응답에 실린다 */
  offset?: number;
  /** 조회 한도(= pageSize) — 스웨거 스키마에는 없으나 실제 응답에 실린다 */
  limit?: number;
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

// ── 서비스통계(일자별 큐브) 공통 축 ───────────────────────────────────────────
/**
 * 메시지 생성 기준(진입점).
 * TEXT_MESSAGE 문자하기 | CONTENT_SEND 콘텐츠 발송 | SITUATION_CUSTOM 고객상황맞춤
 */
export type StatsEntryPoint = 'ALL' | 'TEXT_MESSAGE' | 'CONTENT_SEND' | 'SITUATION_CUSTOM';

/**
 * 메시지 생성 유형(생성방식).
 * GUIDELINE 지침사용 | DRAFT FP초안작성 | MANUAL_EDIT FP직접수정 | OTHER 그외
 */
export type StatsGenerationMethod = 'ALL' | 'GUIDELINE' | 'DRAFT' | 'MANUAL_EDIT' | 'OTHER';

/** FP 유형 — HGS 한금서 | GA | LIFELAB 라이프랩. 현재 전 구간이 HGS 로 쌓인다(사번 판정 미도입) */
export type StatsFpType = 'ALL' | 'HGS' | 'GA' | 'LIFELAB';

/** 서비스통계 페이지 크기 — 이 5종 외 값은 400이다 */
export type StatsPageSize = 10 | 30 | 50 | 70 | 100;

