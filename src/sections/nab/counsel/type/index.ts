// 문서 운영상태 (enum 금지 T-08 — as const 객체 + 유니언)
export const OPERATION_STATUS = ['운영중', '오류', '미운영'] as const;
export type OperationStatus = (typeof OPERATION_STATUS)[number];

// 문서관리 테이블 행
export interface DocumentRow {
  /** 행 식별자 (표시용 no와 별개) */
  id: number;
  no: number;
  /** 보종코드 (여러 개, 개행 포함 가능) */
  productCodes: string;
  /** 판매기간 시작 */
  salePeriodStart: string;
  /** 판매기간 종료 */
  salePeriodEnd: string;
  documentName: string;
  /** 등록자 이름(사번) */
  registrantName: string;
  /** 등록자 소속 */
  registrantDept: string;
  registeredAt: string;
  operationStatus: OperationStatus;
}

// 보험심사 문서 테이블 행 (보종코드·판매기간 없이 반영/종료일자 포함)
export interface InsuranceReviewRow {
  /** 행 식별자 (표시용 no와 별개) */
  id: number;
  no: number;
  documentName: string;
  /** 등록자 이름(사번) */
  registrantName: string;
  /** 등록자 소속 */
  registrantDept: string;
  registeredAt: string;
  /** 반영일자 */
  effectiveStart: string;
  /** 종료일자 */
  effectiveEnd: string;
  operationStatus: OperationStatus;
}

// 보험공통 문서 테이블 행 (보험심사 문서와 동일 구조: 반영/종료일자 포함)
export interface InsuranceCommonRow {
  /** 행 식별자 (표시용 no와 별개) */
  id: number;
  no: number;
  documentName: string;
  /** 등록자 이름(사번) */
  registrantName: string;
  /** 등록자 소속 */
  registrantDept: string;
  registeredAt: string;
  /** 반영일자 */
  effectiveStart: string;
  /** 종료일자 */
  effectiveEnd: string;
  operationStatus: OperationStatus;
}

// 언더라이팅 매뉴얼 테이블 행 (보험공통 구조 + 분류 컬럼)
export interface UnderwritingManualRow {
  /** 행 식별자 (표시용 no와 별개) */
  id: number;
  no: number;
  /** 분류 (예: 업무매뉴얼) */
  category: string;
  documentName: string;
  /** 등록자 이름(사번) */
  registrantName: string;
  /** 등록자 소속 */
  registrantDept: string;
  registeredAt: string;
  /** 반영일자 */
  effectiveStart: string;
  /** 종료일자 */
  effectiveEnd: string;
  operationStatus: OperationStatus;
}

// 상담 Plus AI 통계 관리 테이블 행 (넓은 통계 테이블)
export interface StatisticsRow {
  id: number;
  /** 일시 */
  datetime: string;
  /** 사용자(ID) */
  userId: string;
  /** 사업본부 */
  division: string;
  /** 권역 */
  region: string;
  /** 지역단 */
  district: string;
  /** 지점 */
  branch: string;
  /** 룸ID */
  roomId: string;
  /** 화면 */
  screen: string;
  /** 코드 */
  code: string;
  /** 질문 */
  question: string;
  /** 답변 */
  answer: string;
  /** 생성 모델 */
  model: string;
  /** 소요시간(초) */
  elapsedSec: string;
  /** 비용(달러) */
  cost: string;
  /** 피드백 */
  feedback: string;
  /** 피드백 사유 */
  feedbackReason: string;
}

// 문서 상세 - 수정 이력 항목
export interface ReviewHistoryEntry {
  id: number;
  /** 변경 일시 (예: 2026.01.12 08:30) */
  changedAt: string;
  /** 수정자 이름(사번) */
  editor: string;
  /** 변경 상세 (예: '운영일자 : 2026.01.01 / 00:00 → 2026.06.01 / 23:30') */
  changes: string[];
}
