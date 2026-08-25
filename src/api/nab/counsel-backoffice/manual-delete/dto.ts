import type { DocumentDeleteResult } from '../types';

/** POST /v1/delete/counsel/admin/manual — 매뉴얼문서삭제 (소프트삭제) */

export interface ManualDeleteRequest {
  /** 삭제할 매뉴얼문서ID 목록 (최대 100건). 중복은 무시된다 */
  nabCuslManlDcmtIdList: number[];
}

export type ManualDeleteResponse = DocumentDeleteResult;
