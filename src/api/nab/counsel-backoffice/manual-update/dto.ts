import type { ManualStatus } from '../types';

/** POST /v1/post/counsel/admin/manual/update — 매뉴얼문서수정 (적용기간만 바꾼다) */

export interface ManualUpdateRequest {
  nabCuslManlDcmtId: number;
  /** 적용 시작일시 (KST, 필수). 미래로 두면 예약 게시가 된다 */
  valdStarDttm: string;
  /** 적용 종료일시 (KST). null 이면 '무기한으로 변경'이며 미변경이 아니다 */
  valdEndDttm?: string | null;
}

export interface ManualUpdateResponse {
  nabCuslManlDcmtId: number;
  /** 갱신된 기간으로 다시 계산한 노출상태. 처리중·오류 문서는 기간과 무관하게 유지된다 */
  status: ManualStatus;
}
