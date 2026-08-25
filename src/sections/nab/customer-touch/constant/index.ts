import type { ServiceFeatureCode, ServiceToggleItem, ServiceToggleState, StatRow } from '../type';
import type { PromptSearchScope } from '../../../../api/nab/customer-touch';

// ---------------------------------------------------------------- 프롬프트 관리
/** 필터 셀렉트의 '전체' 옵션 값 */
export const FILTER_ALL = '전체';

/**
 * 셀렉트 옵션(유형/카테고리)은 서버 카탈로그(prompt/categories)에서 받아 쓴다.
 * 화면의 '유형' = API category(1-depth), '카테고리' = API item(2-depth)이며
 * 시나리오 계열(일반/콘텐츠)의 항목만 코드라서 아래 라벨로 바꿔 보여준다.
 */
export const PROMPT_ITEM_LABEL: Record<string, string> = {
  common: '공통',
  guideline: '지침후보',
  validation: '검증',
};

/** 항목(2-depth) 코드를 화면 라벨로 — 시나리오 계열이 아니면 값이 곧 라벨이다 */
export const promptItemLabel = (item: string): string => PROMPT_ITEM_LABEL[item] ?? item;

/** 검색어 적용 범위 — 목록 API의 searchScope(ALL/NAME/MODIFIER)에 대응한다 */
export const PROMPT_SEARCH_SCOPE_OPTIONS = [FILTER_ALL, '프롬프트명', '최종 수정자'];

export const PROMPT_SEARCH_SCOPE_CODE: Record<string, PromptSearchScope> = {
  [FILTER_ALL]: 'ALL',
  프롬프트명: 'NAME',
  '최종 수정자': 'MODIFIER',
};

/** 오늘 날짜(yyyy-MM-dd) — date 인풋과 목록 API가 쓰는 형식 */
export const todayDateString = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');

  return `${now.getFullYear()}-${month}-${date}`;
};

// ---------------------------------------------------------------- 서비스 관리
/** key는 Kill-Switch 기능코드 그대로 — killswitch/check 응답 맵의 키가 된다. */
export const SERVICE_TOGGLES: ServiceToggleItem[] = [
  {
    key: 'AI_MESSAGE_GENERATION',
    label: 'AI 메시지 생성',
    helper: 'OFF 설정 시 어드민 등록된 기본 발송 메시지로 대체, [문자하기] 버튼 클릭 시 FP 직접 입력 없이 문자앱 바로 호출',
  },
  {
    key: 'AI_CONTENT_SEARCH',
    label: 'AI 콘텐츠 검색',
    helper: 'OFF 설정 시 기존 콘텐츠 키워드 검색으로 대체',
  },
  {
    key: 'AI_CUSTOMER_RECOMMEND',
    label: 'AI 고객 추천',
    helper: 'OFF 설정 시 진입 플로팅 버튼 미노출',
  },
];

/** killswitch/check 요청에 그대로 싣는 기능코드 목록 */
export const SERVICE_FEATURE_CODES: ServiceFeatureCode[] = SERVICE_TOGGLES.map((item) => item.key);

/** 기능코드 → 화면 라벨 (미등록 기능을 새로 저장할 때 featureName 기본값으로도 쓴다) */
export const SERVICE_TOGGLE_LABEL = SERVICE_TOGGLES.reduce(
  (acc, item) => ({ ...acc, [item.key]: item.label }),
  {} as Record<ServiceFeatureCode, string>,
);

export const INITIAL_TOGGLE_STATE: ServiceToggleState = SERVICE_TOGGLES.reduce(
  (acc, item) => ({ ...acc, [item.key]: false }),
  {} as ServiceToggleState,
);

// ---------------------------------------------------------------- 통계
// 통계 테이블: 일자 + (채널 그룹 × 지표) 매트릭스
export const STAT_GROUPS = ['전체', '한금서', 'GA', '라이프랩'] as const;

// AI 메시지 생성 / AI 고객 추천 탭 지표
export const MESSAGE_METRICS = [
  '접속 FP수',
  '메시지 생성 건수',
  '메시지 수정 건수',
  '메시지 발송 건수',
  '발송 고객 수(UV)',
  '열람 고객 수(UV)',
  '발송 후 계약 고객 수(UV)',
] as const;

// AI 콘텐츠 검색 탭 지표
export const CONTENT_SEARCH_METRICS = ['접속 FP수', '검색 실행 수'] as const;

const DATES = [
  '2026-11-15', '2026-11-14', '2026-11-13', '2026-11-12', '2026-11-11',
  '2026-11-10', '2026-11-09', '2026-11-08', '2026-11-07', '2026-11-06',
];

export function makeMockStatRows(metricCount: number): StatRow[] {
  const cellCount = STAT_GROUPS.length * metricCount;
  return DATES.map((date) => ({
    date,
    cells: Array.from({ length: cellCount }, () => '000'),
  }));
}

export const MOCK_MESSAGE_ROWS: StatRow[] = makeMockStatRows(MESSAGE_METRICS.length);
export const MOCK_CONTENT_SEARCH_ROWS: StatRow[] = makeMockStatRows(CONTENT_SEARCH_METRICS.length);
