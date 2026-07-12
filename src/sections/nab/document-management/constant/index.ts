import type { RegistrationStatus } from '../type';

/** 페이지당 문서 수 */
export const LIMIT = 10;

/** API 승인/업로드 상태 → 화면 등록 상태 */
export const APPROVAL_STATUS_MAP: Record<string, RegistrationStatus> = {
  PENDING: '진행',
  APPROVED: '완료',
  REJECTED: '실패',
  UPLOADING: '진행',
  PROCESSING: '진행',
  COMPLETED: '완료',
  FAILED: '실패',
};
