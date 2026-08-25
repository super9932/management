import type {
  StipulationSearchType,
  StipulationStatus,
} from '../../../../api/nab/counsel-backoffice';
import type {
  DocumentRow,
  InsuranceCommonRow,
  InsuranceReviewRow,
  OperationStatus,
  ReviewHistoryEntry,
  StatisticsRow,
  UnderwritingManualRow,
} from '../type';

/** 페이지당 문서 수 */
export const PAGE_SIZE = 10;

/** 관리 부서 (결과 바 우측 표기) */
export const MANAGING_DEPT = '상품시스템팀';

/** 운영상태 필터 옵션 */
export const OPERATION_FILTER_OPTIONS = ['전체', '운영중', '오류', '미운영'] as const;

/** 검색기준 필터 옵션 */
export const SEARCH_TYPE_OPTIONS = ['전체', '보종코드', '문서명', '등록자'] as const;

// ── 약관문서 목록 API(04. 상담AI_백오피스) 연동용 ────────────────────────────
/** 약관은 노출상태가 PENDING/ERROR/OPERATING 뿐이라 '미운영'이 없다 */
export const TERMS_OPERATION_FILTER_OPTIONS = ['전체', '운영중', '대기중', '오류'] as const;

/** 화면 노출상태 → API status (전체는 미전송) */
export const TERMS_STATUS_CODE: Record<string, StipulationStatus | undefined> = {
  전체: undefined,
  운영중: 'OPERATING',
  대기중: 'PENDING',
  오류: 'ERROR',
};

/** API status → 화면 운영상태 칩 라벨 */
export const TERMS_STATUS_LABEL: Record<StipulationStatus, OperationStatus> = {
  OPERATING: '운영중',
  PENDING: '대기중',
  ERROR: '오류',
};

/** 약관 검색기준 — API에 '전체' 옵션이 없다 */
export const TERMS_SEARCH_TYPE_OPTIONS = ['문서명', '보종코드'] as const;

/** 화면 검색기준 → API searchType */
export const TERMS_SEARCH_TYPE_CODE: Record<string, StipulationSearchType> = {
  문서명: 'STPL_PDF_FILE_NM',
  보종코드: 'ISRN_KIND_CODE',
};

const SAMPLE_STATUSES: OperationStatus[] = [
  '오류', '미운영', '운영중', '운영중', '운영중',
  '운영중', '운영중', '운영중', '운영중', '운영중',
];

export const MOCK_ROWS: DocumentRow[] = Array.from({ length: PAGE_SIZE }, (_, i) => ({
  id: i + 1,
  no: 99999,
  productCodes: '1818-027, 1818-028,\n1818-029, 1818-030,\n1818-031, 1818-032,\n1818-033',
  salePeriodStart: '2008.04.01~',
  salePeriodEnd: '2008.06.30',
  documentName:
    '한화생명 프라임통합종신보험(무)[저해지환급형]_1818-027~050, 1832-002_약관_20170101~20170331.pdf',
  registrantName: '김한화(2230204)',
  registrantDept: '상품시스템팀',
  registeredAt: '2026.06.01',
  operationStatus: SAMPLE_STATUSES[i] ?? '운영중',
}));

/** 목업 총 건수 */
export const MOCK_TOTAL = 99999;

// ---------------------------------------------------------------- 보험심사 문서
/** 보험심사 문서 관리 부서 */
export const REVIEW_MANAGING_DEPT = '보험심사팀';

/** 보험심사 문서 검색기준 옵션 (보종코드 없음) */
export const REVIEW_SEARCH_TYPE_OPTIONS = ['전체', '문서명', '등록자'] as const;

/** 운영상태 선택 옵션 (상세 모달) */
/** 문서 상세 - 운영상태 드롭다운 옵션 (COM_공통정의_003 3-B) */
export const OPERATION_STATUS_OPTIONS = ['운영중', '대기중'] as const;

/** 반영/종료 일시 선택 옵션 — 30분 단위 (COM_공통정의_003 3-C/3-D) */
export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';

  return `${hour}:${minute}`;
}).concat('24:00');

/**
 * 서버 시간 기준 작업 제한 시간 (COM_공통정의_003 10-E).
 * 이 구간에는 변경내용 저장·문서 삭제를 막는다.
 */
export const RESTRICTED_WORK_HOUR_START = 23;
export const RESTRICTED_WORK_HOUR_END = 24;

/** 문서 상세 - 수정 이력 목업 */
export const MOCK_REVIEW_HISTORY: ReviewHistoryEntry[] = [
  {
    id: 1,
    changedAt: '2026.01.12 08:30',
    editor: '김한화(2230000)',
    changes: [
      '운영일자 : 2026.01.01 / 00:00 → 2026.06.01 / 23:30',
      '종료일자 : 2026.12.31 / 00:00 → 2027.06.01 / 23:30',
    ],
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    id: i + 2,
    changedAt: '2026.01.11 08:30',
    editor: '김한화(2230000)',
    changes: ['운영일자 : 2026.01.01 / 00:00 → 2026.06.01 / 23:30'],
  })),
];

export const MOCK_REVIEW_ROWS: InsuranceReviewRow[] = Array.from({ length: PAGE_SIZE }, (_, i) => ({
  id: i + 1,
  no: 99999,
  documentName: '260430_보험심사팀_사고보험금 청구 관련 주요 사항 (1).docx',
  registrantName: '이생명(2230205)',
  registrantDept: '보험심사팀',
  registeredAt: '2026.06.01',
  effectiveStart: '2026.01.01 08:00:00~',
  effectiveEnd: '-',
  operationStatus: SAMPLE_STATUSES[i] ?? '운영중',
}));

// ---------------------------------------------------------------- 보험공통 문서
/** 보험공통 문서 관리 부서 */
export const COMMON_MANAGING_DEPT = '보험서비스팀';

export const MOCK_COMMON_ROWS: InsuranceCommonRow[] = Array.from({ length: PAGE_SIZE }, (_, i) => ({
  id: i + 1,
  no: 99999,
  documentName: '01. 인적사항 정정 업무지침.pdf',
  registrantName: '박한화(2230206)',
  registrantDept: '보험서비스팀',
  registeredAt: '2026.06.01',
  effectiveStart: '2026.01.01 08:00:00~',
  effectiveEnd: '-',
  operationStatus: SAMPLE_STATUSES[i] ?? '운영중',
}));

// ---------------------------------------------------------------- 상담 Plus AI 통계
/** 통계 총 건수 */
export const STATISTICS_TOTAL = 10285;

const STATISTICS_FEEDBACK = ['좋아요', '싫어요', '-', '-', '좋아요', '-', '싫어요', '-', '좋아요', '-'];

export const MOCK_STATISTICS_ROWS: StatisticsRow[] = Array.from({ length: PAGE_SIZE }, (_, i) => ({
  id: i + 1,
  datetime: '2026.07.13',
  userId: '22302051',
  division: '1사업본부',
  region: '서울권역',
  district: '서울지역단',
  branch: '서울지점',
  roomId: '00001',
  screen: '신계약',
  code: '00001',
  question: '질의 내용을 입력해 주세요 질의 내용을 입력해 주세요 질의 내용을 입력해 주세요',
  answer: '답변 내용을 입력해 주세요 답변 내용을 입력해 주세요 답변 내용을 입력해 주세요',
  model: 'gemini-3-flash',
  elapsedSec: '123.45',
  cost: '678.90',
  feedback: STATISTICS_FEEDBACK[i] ?? '-',
  feedbackReason: '-',
}));

// ---------------------------------------------------------------- 언더라이팅 매뉴얼
/** 언더라이팅 매뉴얼 관리 부서 */
export const UNDERWRITING_MANAGING_DEPT = '언더라이팅팀';

export const MOCK_UNDERWRITING_ROWS: UnderwritingManualRow[] = Array.from({ length: PAGE_SIZE }, (_, i) => ({
  id: i + 1,
  no: 99999,
  category: '업무매뉴얼',
  documentName: 'H간병보험 UW 원시트_26.02.xlsx',
  registrantName: '최금융(2230207)',
  registrantDept: '언더라이팅팀',
  registeredAt: '2026.06.01',
  effectiveStart: '2026.01.01 08:00:00~',
  effectiveEnd: '-',
  operationStatus: SAMPLE_STATUSES[i] ?? '운영중',
}));

// ---------------------------------------------------------------- 문서 등록 모달
/** 문서 첨부 지원 형식 (input accept) */
export const DOCUMENT_ACCEPT = '.pdf,.csv,.docx';

/**
 * 문서 등록 관련 alert 프리셋 (파일형식/용량초과/첨부오류/등록확인/등록이탈).
 * cancelLabel 이 없으면 단일 확인 버튼.
 * (현재는 컴포넌트만 준비 — 실제 트리거는 후속 작업에서 연결)
 */
export const DOCUMENT_ALERTS = {
  fileFormat: {
    title: '지원하지 않는 파일 형식',
    message: '지원하지 않는 파일 형식입니다.\n파일 형식을 확인한 후 다시 첨부해 주세요.',
    confirmLabel: '확인',
  },
  fileSize: {
    title: '첨부파일 용량 초과',
    message: '첨부 가능한 파일 용량을 초과했습니다.\n파일 용량을 확인한 후 다시 첨부해 주세요.',
    confirmLabel: '확인',
  },
  fileError: {
    title: '첨부파일 오류',
    message: '파일 첨부에 실패했습니다.\n오류 파일을 제외하고 계속 진행하시겠습니까?',
    confirmLabel: '계속',
    cancelLabel: '취소',
  },
  registerConfirm: {
    title: '문서 등록',
    message: '문서를 등록하시겠습니까?\n확인을 선택하면 등록이 진행되며, 반영 정보는 익일 적용됩니다.',
    confirmLabel: '확인',
    cancelLabel: '취소',
  },
  leaveConfirm: {
    title: '문서 등록 중지',
    message: '등록 중인 문서가 있습니다.\n닫기를 선택하면 입력한 정보와 첨부파일이 저장되지 않습니다.',
    confirmLabel: '닫기',
    cancelLabel: '취소',
  },
  // ── 문서 상세 (COM_공통정의_003 10. 관련 모달) ──────────────────────────────
  detailLeaveConfirm: {
    title: '변경사항 미저장',
    message: '저장하지 않은 변경 내용이 있습니다.\n닫기를 선택하면 변경 내용이 저장되지 않습니다.',
    confirmLabel: '닫기',
    cancelLabel: '취소',
  },
  detailSaveConfirm: {
    title: '변경내용 저장',
    message: '변경 내용을 저장하시겠습니까?',
    confirmLabel: '확인',
    cancelLabel: '취소',
  },
  detailDeleteConfirm: {
    title: '문서 삭제',
    message: '문서를 삭제하시겠습니까?\n삭제한 문서는 복구할 수 없습니다.',
    confirmLabel: '삭제',
    cancelLabel: '취소',
  },
  restrictedTime: {
    title: '작업 제한 시간',
    message: '23:00 ~ 24:00 에는 문서 저장·삭제를 할 수 없습니다.\n작업 제한 시간이 지난 후 다시 시도해 주세요.',
    confirmLabel: '확인',
  },
} as const;

/** 문서 상세 - 작업 결과 토스트 문구 (COM_공통정의_003 10-B/10-C) */
export const DOCUMENT_DETAIL_TOASTS = {
  saveSuccess: '변경 내용을 저장했습니다.',
  saveFail: '변경 내용 저장에 실패했습니다.',
  deleteSuccess: '문서를 삭제했습니다.',
  deleteFail: '문서 삭제에 실패했습니다.',
  noChanges: '변경된 내용이 없습니다.',
} as const;
