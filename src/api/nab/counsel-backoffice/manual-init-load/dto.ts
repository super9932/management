import type { AdminTypeCode, InitLoadResult, ManualClassCode } from '../types';

/**
 * POST /v1/post/counsel/admin/manual/init-load — 매뉴얼문서초기적재
 *
 * Storage 에 이미 올라가 있는 객체를 키로 지정해 일괄 등록한다(운영 초기 이관용).
 * 건수 상한은 없고, 이미 적재된 키는 SKIPPED 로 건너뛴다.
 */

/** 적재 실패·건너뜀 사유 */
export type ManualInitLoadReason =
  | 'KEY_MISSING'
  | 'MANUAL_NAME_MISSING'
  | 'VALD_START_MISSING'
  | 'ADMR_TYPE_INVALID'
  | 'CLSF_INVALID'
  | 'VALIDITY_PERIOD_INVALID'
  | 'PREFIX_NOT_ALLOWED'
  | 'DUPLICATE_IN_REQUEST'
  | 'ALREADY_LOADED'
  | 'NOT_FOUND_IN_STORAGE'
  | 'SAVE_FAILED';

export interface ManualInitLoadItem {
  /** 객체키 */
  key: string;
  /** 매뉴얼명 — 확장자 포함 파일 전체 이름. 등록 후에는 변경할 수 없다 */
  manlNm: string;
  /** 관리주체 */
  nabCuslAdmrTypeCode: AdminTypeCode;
  /** 매뉴얼 분류. 관리주체에 속하지 않는 코드는 그 항목만 실패한다 */
  manlClsfCode: ManualClassCode;
  /** 적용 시작일시 (KST) */
  valdStarDttm: string;
  /** 적용 종료일시 (KST). 미입력이면 무기한 */
  valdEndDttm?: string;
}

export interface ManualInitLoadRequest {
  /** 적재할 매뉴얼문서 목록 */
  items: ManualInitLoadItem[];
}

export interface ManualInitLoadResultItem {
  /** 요청한 객체키. 어느 항목의 결과인지 대조하는 값이다 */
  key: string;
  /** 채번된 매뉴얼문서ID. LOADED 일 때만 채워진다 */
  nabCuslManlDcmtId: number | null;
  result: InitLoadResult;
  /** LOADED 가 아닐 때의 사유 */
  reason: ManualInitLoadReason | null;
}

export interface ManualInitLoadResponse {
  /** 요청 건수 */
  requestedCount: number;
  /** 적재된 건수 (처리중 상태로 저장되고 AI BE 전송이 예약된다) */
  loadedCount: number;
  /** 건너뛴 건수 (이미 적재된 키) */
  skippedCount: number;
  /** 실패한 건수 */
  failedCount: number;
  /** 요청 순서 그대로의 건별 결과 */
  items: ManualInitLoadResultItem[];
}
