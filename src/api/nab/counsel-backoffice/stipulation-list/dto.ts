import type { PageRequest, RegisteredDateRange, SortDirection, StipulationStatus } from '../types';

/**
 * POST /v1/get/counsel/admin/stipulation/list — 약관문서 목록 조회
 *
 * 삭제되지 않은 약관문서를 등록일자 구간·노출상태·검색조건으로 조회한다.
 * 검색기준 미입력 시 문서명(STPL_PDF_FILE_NM), 정렬 미입력 시 번호 내림차순이 적용된다.
 */

/** 검색기준 — '전체' 옵션은 없다 */
export type StipulationSearchType = 'STPL_PDF_FILE_NM' | 'ISRN_KIND_CODE';

/** 정렬기준 */
export type StipulationSortBy =
  | 'nabCuslIsrnStplDcmtId'
  | 'rgstDttm'
  | 'saleStarDate'
  | 'pdfDcmtFileNm';

export interface StipulationListRequest extends PageRequest, RegisteredDateRange {
  /** 노출상태 필터. 미입력 시 전체 */
  status?: StipulationStatus;
  /** 검색기준. 미입력 시 STPL_PDF_FILE_NM (PDF 파일명 부분일치 / 보종세목코드 전방일치) */
  searchType?: StipulationSearchType;
  /** 검색어. 미입력 시 검색조건 미적용 */
  keyword?: string;
  /** 정렬기준. 미입력 시 번호(nabCuslIsrnStplDcmtId) */
  sortBy?: StipulationSortBy;
  /** 정렬방향. 미입력 시 DESC */
  sortDir?: SortDirection;
}

export interface StipulationItem {
  /** 약관문서ID */
  nabCuslIsrnStplDcmtId: number;
  /** 약관PDF파일명 */
  pdfDcmtFileNm: string;
  /** 약관CSV파일명 */
  csvDcmtFileNm: string;
  /** 보종세목코드 목록 — 전처리 완료 콜백이 채우며 처리중·오류 문서는 빈 배열 */
  isrnKindCodeList: string[];
  /** 판매시작일(yyyy-MM-dd) — 전처리 완료 콜백이 채우는 표시 전용 값. 전처리 전이면 null */
  saleStarDate: string | null;
  /** 판매종료일(yyyy-MM-dd) — 전처리 완료 콜백이 채우는 표시 전용 값. 전처리 전이면 null */
  saleEndDate: string | null;
  /** 노출상태 */
  status: StipulationStatus;
  /** 등록기관명 */
  rgstOrgnNm: string;
  /** 등록자명 */
  rgsrNm: string;
  /** 등록일시(KST, yyyy-MM-dd HH:mm:ss) */
  rgstDttm: string;
}

/** 페이징 정보는 응답 본문이 아니라 공통 엔벨로프의 page 필드에 담긴다 */
export interface StipulationListResponse {
  /** 조건에 맞는 문서가 없으면 빈 배열 */
  stplDocList: StipulationItem[];
}
