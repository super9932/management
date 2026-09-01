import type {
  AdminTypeCode,
  ManualClassCode,
  ManualStatus,
  PageRequest,
  RegisteredDateRange,
  SortDirection,
} from '../types';

/** POST /v1/get/counsel/admin/manual/list — 매뉴얼문서목록조회 */

/** 정렬기준. valdStarDttm 은 화면의 적용기간 컬럼(유효시작일시)에 대응한다 */
export type ManualSortBy = 'nabCuslManlDcmtId' | 'rgstDttm' | 'valdStarDttm' | 'manlNm';

export interface ManualListRequest extends PageRequest, RegisteredDateRange {
  /** 관리주체(필수). 화면이 관리주체 단위로 나뉘어 '전체' 옵션이 없다 */
  nabCuslAdmrTypeCode: AdminTypeCode;
  /** 매뉴얼 분류 필터(관리주체 하위). 미입력 시 그 관리주체 전체 조회 */
  manlClsfCode?: ManualClassCode;
  /** 노출상태 필터. 미입력 시 전체 조회 */
  status?: ManualStatus;
  /** 매뉴얼명 검색어(부분일치). 미입력 시 검색조건을 적용하지 않는다 */
  keyword?: string;
  /** 정렬기준. 미입력 시 docId(번호) */
  sortBy?: ManualSortBy;
  /** 정렬방향. 미입력 시 DESC */
  sortDir?: SortDirection;
}

export interface ManualItem {
  /** 매뉴얼문서ID */
  nabCuslManlDcmtId: number;
  /** 매뉴얼명 */
  manlNm: string;
  /** 관리주체. 알 수 없는 저장 코드면 null */
  nabCuslAdmrTypeCode: AdminTypeCode | null;
  /** 매뉴얼 분류. 분류 도입 이전 등록분이거나 알 수 없는 저장 코드면 null */
  manlClsfCode: ManualClassCode | null;
  /** 유효시작일시 (KST) */
  valdStarDttm: string;
  /** 유효종료일시 (KST). 종료를 정하지 않은 매뉴얼은 null 이며 무기한 운영으로 본다 */
  valdEndDttm: string | null;
  /** 노출상태. 조회 시점에 계산하며 DB 에 저장하지 않는다 */
  status: ManualStatus;
  /** 등록기관명 */
  rgstOrgnNm: string;
  /** 등록자명 */
  rgsrNm: string;
  /** 등록일시 (KST) */
  rgstDttm: string;
}

export interface ManualListResponse {
  /** 매뉴얼문서 목록. 조건에 맞는 문서가 없으면 빈 배열(정상 응답) */
  manlDocList: ManualItem[];
}
