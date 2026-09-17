import type {
  AdminTypeCode,
  ManualClassCode,
  ManualStatus,
  StipulationSearchType,
  StipulationStatus,
} from '../../../../api/nab/counsel-backoffice';
import type { OperationStatus } from '../type';

/** 페이지당 문서 수 */
export const PAGE_SIZE = 10;

/** 관리 부서 (결과 바 우측 표기) */
export const MANAGING_DEPT = '상품시스템팀';

/** 운영상태 필터 옵션 */
export const OPERATION_FILTER_OPTIONS = ['전체', '운영중', '오류', '대기중'] as const;

/** 검색기준 필터 옵션 */
export const SEARCH_TYPE_OPTIONS = ['전체', '보종코드', '문서명', '등록자'] as const;

// ── 약관문서 목록 API(04. 상담AI_백오피스) 연동용 ────────────────────────────
/** 약관은 노출상태가 PENDING/ERROR/OPERATING 뿐이라 '대기중'(NOT_OPERATING)이 없다 */
export const TERMS_OPERATION_FILTER_OPTIONS = ['전체', '운영중', '처리중', '오류'] as const;

/** 화면 노출상태 → API status (전체는 미전송) */
export const TERMS_STATUS_CODE: Record<string, StipulationStatus | undefined> = {
  전체: undefined,
  운영중: 'OPERATING',
  처리중: 'PENDING',
  오류: 'ERROR',
};

/** API status → 화면 운영상태 칩 라벨 */
export const TERMS_STATUS_LABEL: Record<StipulationStatus, OperationStatus> = {
  OPERATING: '운영중',
  // 스웨거가 PENDING 을 '처리중'(AI BE 전처리 진행 중)으로 부른다
  PENDING: '처리중',
  ERROR: '오류',
};

// ── 매뉴얼문서 목록 API(04. 상담AI_백오피스) 연동용 ──────────────────────────
/** 화면 ↔ 관리주체 코드 (매뉴얼 API 하나를 세 화면이 공유한다) */
export const MANUAL_ADMIN_TYPE = {
  underwriting: 'UDW',
  insuranceReview: 'ISRN_ADT',
  insuranceCommon: 'ISRN_SVC',
} as const satisfies Record<string, AdminTypeCode>;

/** 관리주체 코드 → 화면 표기(담당부서). 통계 표의 참조 문서 컬럼이 쓴다 */
export const MANUAL_ADMIN_TYPE_LABEL: Record<AdminTypeCode, string> = {
  UDW: '언더라이팅',
  ISRN_ADT: '보험심사',
  ISRN_SVC: '보험공통',
};

/** 매뉴얼 노출상태 옵션 — ManualStatus 4종 + 전체 */
export const MANUAL_OPERATION_FILTER_OPTIONS = ['전체', '운영중', '처리중', '대기중', '오류'] as const;

/** 화면 노출상태 → API status (전체는 미전송) */
export const MANUAL_STATUS_CODE: Record<string, ManualStatus | undefined> = {
  전체: undefined,
  운영중: 'OPERATING',
  처리중: 'PENDING',
  대기중: 'NOT_OPERATING',
  오류: 'ERROR',
};

/** API status → 화면 운영상태 칩 라벨 */
export const MANUAL_STATUS_LABEL: Record<ManualStatus, OperationStatus> = {
  OPERATING: '운영중',
  // PENDING 은 전처리 진행 중, NOT_OPERATING 은 반영일자 미도래·종료일자 도래다
  PENDING: '처리중',
  NOT_OPERATING: '대기중',
  ERROR: '오류',
};

/** 매뉴얼 검색기준 — API가 매뉴얼명(keyword) 부분일치만 지원한다 */
export const MANUAL_SEARCH_TYPE_OPTIONS = ['문서명'] as const;

// ── 매뉴얼 분류 ──────────────────────────────────────────────────────────────
/** API 분류코드 → 화면 표기 */
export const MANUAL_CLASS_LABEL: Record<ManualClassCode, string> = {
  ONE_SHET: '원시트',
  BSWR_MANL: '업무매뉴얼',
  ISRN_UNDN: '심사',
  PLAN: '기획',
  DPST: '입금',
  RE_OTPY: '제지급',
  CTCN: '계약변경',
  CNTR_SUPT: '센터지원',
};

/**
 * 관리주체별 선택 가능한 분류.
 * 관리주체에 속하지 않는 코드를 보내면 서버가 거절하므로 셀렉트 후보를 여기서 좁힌다.
 */
export const MANUAL_CLASS_BY_ADMIN_TYPE: Record<AdminTypeCode, ManualClassCode[]> = {
  UDW: ['ONE_SHET', 'BSWR_MANL'],
  ISRN_ADT: ['ISRN_UNDN'],
  ISRN_SVC: ['PLAN', 'DPST', 'RE_OTPY', 'CTCN', 'CNTR_SUPT'],
};

/** 분류 필터 옵션 — '전체' + 그 관리주체의 분류 표기 */
export const manualClassFilterOptions = (adminType: AdminTypeCode): string[] => [
  '전체',
  ...MANUAL_CLASS_BY_ADMIN_TYPE[adminType].map((code) => MANUAL_CLASS_LABEL[code]),
];

/** 화면 표기 → API 분류코드 ('전체'는 미전송) */
export const manualClassCode = (
  adminType: AdminTypeCode,
  label: string,
): ManualClassCode | undefined =>
  MANUAL_CLASS_BY_ADMIN_TYPE[adminType].find((code) => MANUAL_CLASS_LABEL[code] === label);

/** 약관 검색기준 — API에 '전체' 옵션이 없다 */
export const TERMS_SEARCH_TYPE_OPTIONS = ['문서명', '보종코드'] as const;

/** 화면 검색기준 → API searchType */
export const TERMS_SEARCH_TYPE_CODE: Record<string, StipulationSearchType> = {
  문서명: 'STPL_PDF_FILE_NM',
  보종코드: 'ISRN_KIND_CODE',
};

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

// ---------------------------------------------------------------- 보험공통 문서
/** 보험공통 문서 관리 부서 */
export const COMMON_MANAGING_DEPT = '보험서비스팀';

// ---------------------------------------------------------------- 상담 Plus AI 통계
/** 화면 구분 코드 → 표시명 (통계 API 는 코드만 내려주고 변환은 FE 몫) */
export const COUNSEL_SCREEN_LABEL: Record<string, string> = {
  '01': '타겟고객발굴',
  '02': '고객계약관리',
  '03': '신계약상담',
};

/** 통계 목록 결과 바 안내 (DAS_통계정보_001) — 변경 이력이 조회 결과에 어떻게 반영되는지 */
export const STATISTICS_RESULT_NOTICE =
  '조회 기간 중 변경사항이 발생한 경우, 변경 전 데이터는 당시 정보로 유지되고 변경시점 이후부터 변경된 정보가 반영됩니다.';

/** 통계 화면 토스트 */
export const STATISTICS_TOASTS = {
  excelFail: '엑셀 다운로드에 실패했습니다.',
} as const;

// ---------------------------------------------------------------- 언더라이팅 문서
/** 언더라이팅 문서 관리 부서 */
export const UNDERWRITING_MANAGING_DEPT = '언더라이팅팀';

// ---------------------------------------------------------------- 문서 등록 모달
/** 문서 첨부 지원 형식 (input accept) */
export const DOCUMENT_ACCEPT = '.pdf,.csv,.docx';

/**
 * 첨부 가능한 최대 파일 용량(MB) — COM_공통정의_006 3-A/5-A 의 '최대 허용 용량'.
 * TODO: 기획서·API 스펙에 수치가 없어 임시값이다. BE 확인 후 교체한다.
 */
export const MAX_ATTACHMENT_SIZE_MB = 50;

/** 약관 등록 파일명 불일치 안내 (유효성 검사 실패 배너) */
export const TERMS_FILENAME_MISMATCH_MESSAGE =
  '등록하려는 약관 PDF와 CSV 파일이 일치하지 않습니다. 파일명을 확인한 후 다시 등록해 주세요.';

/** 매뉴얼 등록 결과 토스트 */
export const MANUAL_REGISTER_TOASTS = {
  missingFile: '첨부할 파일을 등록해 주세요.',
  saveSuccess: '문서가 등록되었습니다.',
  saveFail: '문서 등록에 실패했습니다.',
} as const;

/** 약관 등록 유효성 검사 실패 토스트 (COM_공통정의_006 6-B) */
export const TERMS_REGISTER_TOASTS = {
  missingFile: 'PDF와 CSV 파일을 모두 첨부해 주세요.',
  saveSuccess: '문서가 등록되었습니다.',
  saveFail: '문서 등록에 실패했습니다.',
} as const;

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
  /** MOD_변경이탈_001 */
  detailLeaveConfirm: {
    title: '변경사항 닫기',
    message: '저장되지 않은 변경사항이 있습니다.\n닫기를 선택하면 변경한 내용이 저장되지 않습니다.',
    confirmLabel: '닫기',
    cancelLabel: '취소',
  },
  /** MOD_변경확인_001 */
  detailSaveConfirm: {
    title: '변경사항 적용',
    message: '운영 내용을 변경했습니다.\n확인을 선택하면 변경사항이 저장되며, 반영 정보는 익일부터 적용됩니다.',
    confirmLabel: '확인',
    cancelLabel: '취소',
  },
  /** MOD_문서삭제_001 — 확인 버튼이 파괴적 액션(빨강)이다 */
  detailDeleteConfirm: {
    title: '문서삭제 확인',
    message: '문서를 삭제하시겠습니까?\n삭제된 문서는 복구할 수 없습니다.',
    confirmLabel: '삭제',
    cancelLabel: '취소',
  },
  /** MOD_작업안내_001 */
  restrictedTime: {
    title: '작업 가능 시간 안내',
    message: '23:00 ~ 24:00는 작업이 제한되는 시간입니다.\n해당 시간 이후 다시 시도해주세요.',
    confirmLabel: '확인',
  },
} as const;

/** 문서 상세 - 작업 결과 토스트 문구 (COM_공통정의_003 10-B/10-C) */
export const DOCUMENT_DETAIL_TOASTS = {
  saveSuccess: '변경사항이 저장되었습니다.',
  saveFail: '변경사항 저장에 실패했습니다.',
  deleteSuccess: '문서가 삭제되었습니다.',
  deleteFail: '문서 삭제에 실패했습니다.',
  /** 디자인 정의 외 — 변경 없이 저장을 누른 경우의 안내 */
  noChanges: '변경된 내용이 없습니다.',
} as const;

// ---------------------------------------------------------------- 시스템 설정
/**
 * 상담AI 서비스 전체 점검 스위치 코드 (DAS_시스템설정_001).
 * 저장 값은 점검수행여부(ispcAcmpYn)로, Y 가 곧 점검 모드다.
 */
export const COUNSEL_SERVICE_SWITCH_CODE = 'COUNSEL_SERVICE';

/** 스위치가 없을 때 새로 만들며 넣는 이름 */
export const COUNSEL_SERVICE_SWITCH_NAME = '상담AI 서비스';

/** 시스템 설정 화면 문구 (DAS_시스템설정_001 1-A) */
export const SYSTEM_SETTING_TEXT = {
  toggleLabel: '점검 모드 사용 여부',
  toggleHelper: '‘ON’ 설정 시 서비스 진입 시점에 점검 모드 화면이 노출됩니다.',
} as const;

/**
 * 점검모드 전환 확인 팝업 (DAS_시스템설정_001 2-A).
 * ON 으로 바꿔 저장할 때만 뜬다 — OFF 는 별도 얼럿 없이 바로 처리한다.
 */
export const MAINTENANCE_CONFIRM = {
  title: '점검모드로 전환하시겠습니까?',
  message: '점검모드를 적용하면 사용자의 서비스 이용이 즉시 제한됩니다.',
  confirmLabel: '적용',
  cancelLabel: '취소',
} as const;

/** 시스템 설정 저장 결과 안내 */
export const SYSTEM_SETTING_TOASTS = {
  maintenanceOn: '점검모드가 적용되었습니다.',
  maintenanceOff: '점검모드가 해제되었습니다.',
  saveFail: '설정 저장에 실패했습니다.',
  loadFail: '시스템 설정을 불러오지 못했습니다.',
} as const;

// ---------------------------------------------------------------- 목록 기본 조회기간
/** 목록 기본 조회기간(일) — 오늘 포함 최근 30일 */
export const SEARCH_PERIOD_DAYS = 30;

/** 입력값 형식(yyyy-MM-dd) — 네이티브 date 인풋이 받는 형식이다. 로컬 기준이라 UTC 로 밀리지 않는다 */
export const toInputDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};

/** 기본 등록일자 구간 — 오늘 포함 최근 SEARCH_PERIOD_DAYS 일 */
export const defaultSearchPeriod = (): { fromDate: string; toDate: string } => {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - (SEARCH_PERIOD_DAYS - 1));

  return { fromDate: toInputDate(from), toDate: toInputDate(today) };
};

/**
 * 내일 날짜(yyyy-MM-dd) — 문서 반영일자는 익일 00:00부터 선택할 수 있다(COM_공통정의_006).
 * 등록 팝업의 반영/종료일자 기본값이자 선택 가능한 하한이다.
 */
export const tomorrowInputDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return toInputDate(date);
};
