import type { DocumentDeleteResult } from '../types';

/** POST /v1/delete/counsel/admin/stipulation — 약관문서삭제 (소프트삭제) */

export interface StipulationDeleteRequest {
  /** 삭제할 약관문서ID 목록 (최대 100건). 중복은 무시된다 */
  nabCuslIsrnStplDcmtIdList: number[];
}

export type StipulationDeleteResponse = DocumentDeleteResult;
