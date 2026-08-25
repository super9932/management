/**
 * 상담AI 백오피스 API 공용 타입
 * swagger: [NAB] NEXTLAB AI 비즈니스 서비스 API — 04. 상담AI_백오피스
 */

export type { ApiResponse, ApiError, PageInfo, ResponseMeta } from '../customer-touch/types';

// ── 공통 요청 조각 ───────────────────────────────────────────────────────────

/** 페이징 요청 — 목록 API 공통 (page는 1-base) */
export interface PageRequest {
  /** 페이지 번호(1부터). 미입력 시 1 */
  page?: number;
  /** 페이지 크기. 미입력 시 10, 100 초과 시 100으로 제한 */
  size?: number;
}

/** 등록일자 구간 검색 — 목록 API 공통 */
export interface RegisteredDateRange {
  /** 등록일자 검색 시작일(yyyy-MM-dd). 미입력 시 하한 없음 */
  rgstDttmFrom?: string;
  /** 등록일자 검색 종료일(yyyy-MM-dd, 해당일 23:59:59까지). 미입력 시 상한 없음 */
  rgstDttmTo?: string;
}

/** 정렬 방향 */
export type SortDirection = 'ASC' | 'DESC';

// ── 공통 코드 ────────────────────────────────────────────────────────────────

/** 매뉴얼 관리주체 — 화면이 관리주체 단위로 나뉜다 */
export type AdminTypeCode = 'UDW' | 'ISRN_ADT' | 'ISRN_SVC';

/**
 * 매뉴얼 노출상태 — 처리상태·유효기간으로부터 조회 시점에 계산하며 DB에 저장하지 않는다.
 */
export type ManualStatus = 'OPERATING' | 'PENDING' | 'NOT_OPERATING' | 'ERROR';

/**
 * 약관 노출상태 — 약관은 판매기간을 운영 판정에 쓰지 않아
 * 처리상태 완료가 곧 OPERATING이며 NOT_OPERATING은 없다.
 */
export type StipulationStatus = 'PENDING' | 'ERROR' | 'OPERATING';

// ── 공통 응답 ────────────────────────────────────────────────────────────────

/** 문서 삭제(소프트삭제) 공통 응답 */
export interface DocumentDeleteResult {
  /** 이번 요청으로 실제 삭제된 문서 수. 이미 삭제돼 있던 문서는 제외 */
  deletedCount: number;
  /** AI BE 색인 삭제에 실패해 지우지 못한 문서ID 목록. 목록에 그대로 남으며 재요청하면 된다 */
  failedList: number[];
}
