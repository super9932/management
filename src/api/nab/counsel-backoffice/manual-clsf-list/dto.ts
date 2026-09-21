import type { AdminTypeCode, ManualClassCode } from '../types';

/** POST /v1/get/counsel/admin/manual/clsf/list — 매뉴얼분류전체목록조회 */

/**
 * 분류 한 건.
 * 원장이 서버 enum 이라 DB 조회가 없고 정의 순서대로 내려온다.
 * 관리주체별로 좁히는 일은 nabCuslAdmrTypeCode 로 FE 가 한다.
 */
export interface ManualClsfItem {
  /** 목록·상세·통계 응답의 manlClsfCode 와 같은 값 */
  manlClsfCode: ManualClassCode;
  /** 분류 표시명 */
  manlClsfNm: string;
  /** 소속 관리주체 — 화면(언더라이팅/보험심사/보험공통)을 가른다 */
  nabCuslAdmrTypeCode: AdminTypeCode;
}

export interface ManualClsfListResponse {
  /** 전체 목록. 관리주체별로 묶인 정의 순서 그대로다 */
  manlClsfList: ManualClsfItem[];
}
