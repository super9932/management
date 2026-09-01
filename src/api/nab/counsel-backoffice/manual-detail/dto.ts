import type { AdminTypeCode, ManualClassCode, ManualStatus } from '../types';

/** POST /v1/get/counsel/admin/manual/detail — 매뉴얼문서상세조회 */

export interface ManualDetailRequest {
  /** 조회할 매뉴얼문서ID */
  nabCuslManlDcmtId: number;
}

export interface ManualDetailResponse {
  nabCuslManlDcmtId: number;
  /** 매뉴얼명 */
  manlNm: string;
  /** 관리주체. 알 수 없는 저장 코드면 null */
  nabCuslAdmrTypeCode: AdminTypeCode | null;
  /** 매뉴얼 분류. 수정 가능하며 바꾸면 수정이력에 남는다. 도입 이전 등록분은 null */
  manlClsfCode: ManualClassCode | null;
  /**
   * 매뉴얼파일 다운로드 URL. 조회 시점에 발급되는 만료형 주소라 저장·재사용하면 안 된다.
   */
  fileUrlPathNm: string;
  /** 유효시작일시 (KST) */
  valdStarDttm: string;
  /** 유효종료일시 (KST). 무기한이면 null */
  valdEndDttm: string | null;
  status: ManualStatus;
  /** 등록기관명 */
  rgstOrgnNm: string;
  /** 등록자명 */
  rgsrNm: string;
  /** 등록자사번 */
  rgsrEmnb: string;
  /** 등록일시 (KST) */
  rgstDttm: string;
  /** 마지막 수정자명. 수정 이력이 없으면 등록자명과 같다 */
  lastChnrNm: string;
  /** 마지막 수정자 사번. 수정 이력이 없으면 등록자사번과 같다 */
  lastChnrEmnb: string;
  /** 마지막으로 수정한 기관명. 수정 이력이 없으면 등록기관명과 같다 */
  lastChnrOrgnNm: string;
  /** 마지막 수정일시 (KST). 수정 이력이 없으면 등록일시와 같다 */
  lastChngDttm: string;
}
