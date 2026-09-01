import type { ManualClassCode, ManualStatus } from '../types';

/** POST /v1/post/counsel/admin/manual/update — 매뉴얼문서수정 (분류·적용기간을 바꾼다) */

export interface ManualUpdateRequest {
  nabCuslManlDcmtId: number;
  /**
   * 매뉴얼 분류(필수). 문서의 기존 관리주체 하위 값이어야 한다.
   * AI BE 로 통지하지 않는 내부 메타데이터라 유효기간과 달리 즉시 반영된다.
   */
  manlClsfCode: ManualClassCode;
  /** 적용 시작일시 (KST, 필수). 미래로 두면 예약 게시가 된다 */
  valdStarDttm: string;
  /** 적용 종료일시 (KST). null 이면 '무기한으로 변경'이며 미변경이 아니다 */
  valdEndDttm?: string | null;
}

export interface ManualUpdateResponse {
  nabCuslManlDcmtId: number;
  /** 갱신된 기간으로 다시 계산한 노출상태. 처리중·오류 문서는 기간과 무관하게 유지된다 */
  status: ManualStatus;
  /** 반영된 매뉴얼 분류 */
  manlClsfCode: ManualClassCode;
}
