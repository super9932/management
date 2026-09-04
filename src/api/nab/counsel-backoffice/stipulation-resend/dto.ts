/**
 * POST /v1/post/counsel/admin/stipulation/resend — 약관문서AIBE재전송
 *
 * 전처리(색인)가 안 끝났거나 실패한 문서를 AI BE 전송 큐에 다시 넣는다.
 * 이미 완료됐거나 대기 중인 문서는 제출하지 않고 건너뛴다(SKIPPED).
 */

/** 제출 결과 */
export type StipulationResendResult = 'ENQUEUED' | 'SKIPPED' | 'FAILED';

/** ENQUEUED 가 아닐 때의 사유 */
export type StipulationResendReason =
  | 'NOT_FOUND'
  | 'DELETED'
  | 'ALREADY_COMPLETED'
  | 'ALREADY_QUEUED'
  | 'STATUS_CHANGED'
  | 'STATUS_UNKNOWN'
  | 'CSV_PATH_MISSING'
  | 'ENQUEUE_REJECTED';

export interface StipulationResendRequest {
  /** 재전송할 약관문서ID 목록. 중복은 합쳐진다 */
  nabCuslIsrnStplDcmtIdList: number[];
}

export interface StipulationResendResultItem {
  /** 요청한 약관문서ID */
  nabCuslIsrnStplDcmtId: number;
  result: StipulationResendResult;
  /** ENQUEUED 가 아닐 때의 사유 */
  reason: StipulationResendReason | null;
}

export interface StipulationResendResponse {
  /** 요청 건수 (중복을 합친 뒤) */
  requestedCount: number;
  /** 전송 큐에 다시 제출한 건수 */
  enqueuedCount: number;
  /** 제출하지 않고 넘어간 건수 (이미 완료·이미 대기중 등) */
  skippedCount: number;
  /** 제출하지 못한 건수 */
  failedCount: number;
  items: StipulationResendResultItem[];
}
