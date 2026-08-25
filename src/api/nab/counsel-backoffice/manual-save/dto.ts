import type { AdminTypeCode, ManualStatus } from '../types';

/** POST /v1/post/counsel/admin/manual/save — 매뉴얼문서등록 (multipart/form-data) */

/** meta 파트에 JSON 으로 실리는 등록 정보 */
export interface ManualUploadMeta {
  /** 관리주체(필수). AI 서버로 보내는 값과 같다 */
  nabCuslAdmrTypeCode: AdminTypeCode;
  /** 적용 시작일시 (KST, 필수). 미래로 두면 예약 게시가 된다 */
  valdStarDttm: string;
  /** 적용 종료일시 (KST). 미입력이면 무기한 */
  valdEndDttm?: string;
}

export interface ManualSaveRequest {
  /** 매뉴얼 파일 (pdf · csv · docx) */
  file?: File;
  /** 등록 메타 정보(필수) */
  meta: ManualUploadMeta;
}

export interface ManualSaveResponse {
  /** 채번된 매뉴얼문서ID */
  nabCuslManlDcmtId: number;
  /** 처리상태. 등록 직후는 항상 PENDING 이며 색인 완료는 AI BE 콜백으로 반영된다 */
  status: ManualStatus;
}
