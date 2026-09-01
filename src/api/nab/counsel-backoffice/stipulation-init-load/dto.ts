import type { InitLoadResult } from '../types';

/**
 * POST /v1/post/counsel/admin/stipulation/init-load — 약관문서초기적재
 *
 * Storage 에 이미 올라가 있는 PDF·CSV 쌍을 키로 지정해 일괄 등록한다(운영 초기 이관용).
 * 이미 적재된 키는 SKIPPED 로 건너뛴다.
 */

/** 적재 실패·건너뜀 사유 */
export type StipulationInitLoadReason =
  | 'KEY_MISSING'
  | 'FILE_NAME_MISSING'
  | 'PREFIX_NOT_ALLOWED'
  | 'DUPLICATE_IN_REQUEST'
  | 'ALREADY_LOADED'
  | 'NOT_FOUND_IN_STORAGE'
  | 'SAVE_FAILED';

export interface StipulationInitLoadItem {
  /** PDF 객체키. 관리자가 화면에서 내려받는 원본 */
  pdfKey: string;
  /** CSV 객체키. AI BE 전처리(색인) 대상 */
  csvKey: string;
  /** 화면에 표시·검색되는 PDF 문서명 */
  pdfDcmtFileNm: string;
  /** 화면에 표시·검색되는 CSV 문서명 */
  csvDcmtFileNm: string;
}

export interface StipulationInitLoadRequest {
  /** 적재할 약관문서 목록 */
  items: StipulationInitLoadItem[];
}

export interface StipulationInitLoadResultItem {
  /** 요청한 CSV 객체키. 어느 항목의 결과인지 대조하는 값이다 */
  csvKey: string;
  /** 채번된 약관문서ID. LOADED 일 때만 채워진다 */
  nabCuslIsrnStplDcmtId: number | null;
  result: InitLoadResult;
  /** LOADED 가 아닐 때의 사유 */
  reason: StipulationInitLoadReason | null;
}

export interface StipulationInitLoadResponse {
  requestedCount: number;
  loadedCount: number;
  skippedCount: number;
  failedCount: number;
  /** 요청 순서 그대로의 건별 결과 */
  items: StipulationInitLoadResultItem[];
}
