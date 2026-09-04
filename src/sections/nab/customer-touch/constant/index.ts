import type {
  ContentSearchStatRow,
  MessageStatRow,
  ServiceFeatureCode,
  ServiceToggleItem,
  ServiceToggleState,
} from '../type';
import type { PromptSearchScope, StatsFpType } from '../../../../api/nab/customer-touch';

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
/**
 * AI 메시지 생성 탭 표 컬럼 (Figma 4932:31810).
 *
 * 채널 그룹 매트릭스를 쓰던 이전 양식에서 일자 + 지표 5종의 단일 헤더로 바뀌었다.
 * 지표가 stats/message/daily 응답 필드와 1:1이라 조회도 fpType 한 번으로 끝난다.
 */
export const MESSAGE_STAT_COLUMNS = [
  { key: 'date', label: '일자', width: 120 },
  { key: 'fpUv', label: '접속 FP수(UV)', width: 288 },
  { key: 'generate', label: '메시지 생성 건수', width: 288 },
  { key: 'modify', label: '메시지 수정 건수', width: 288 },
  { key: 'send', label: '메시지 발송 건수', width: 288 },
  { key: 'sendCustomerUv', label: '발송 고객 수(UV)', width: 288 },
] as const satisfies readonly { key: keyof MessageStatRow; label: string; width: number }[];

/**
 * AI 콘텐츠 검색 탭 표 컬럼 (Figma 6240:117006).
 * 메시지 탭과 마찬가지로 채널 그룹 매트릭스가 없어진 단일 헤더 표다.
 */
export const CONTENT_SEARCH_STAT_COLUMNS = [
  { key: 'date', label: '일자', width: 120 },
  { key: 'fpUv', label: '접속 FP수(UV)', width: 720 },
  { key: 'search', label: '검색 실행 수', width: 720 },
] as const satisfies readonly { key: keyof ContentSearchStatRow; label: string; width: number }[];

/**
 * 화면 '유형' 필터 → API fpType(FP 유형).
 *
 * 새 표 양식에서 채널 그룹(전체·한금서·GA·라이프랩) 컬럼이 없어지면서 그 축이 필터로 옮겨왔다.
 * 메시지·검색 통계가 함께 받는 유일한 축이라 두 탭에서 모두 쓴다.
 * (메시지 통계에만 있는 entryPoint·generationMethod 는 현재 전체로 고정한다)
 */
export const STAT_FP_TYPE: Record<string, StatsFpType> = {
  [FILTER_ALL]: 'ALL',
  한금서: 'HGS',
  GA: 'GA',
  라이프랩: 'LIFELAB',
};

/** 유형 셀렉트 옵션 */
export const STAT_TYPE_OPTIONS = Object.keys(STAT_FP_TYPE);

/** 통계 조회 기본 기간(일) — 집계 상한선이 어제라 오늘까지 잡아도 마지막 날은 0이다 */
export const STAT_DEFAULT_PERIOD_DAYS = 30;

/** 입력값 형식(yyyy-MM-dd) — 네이티브 date 인풋이 받는 형식이다. 로컬 기준이라 UTC 로 밀리지 않는다 */
export const toScreenDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};

/** 기본 조회기간 — 오늘 포함 최근 STAT_DEFAULT_PERIOD_DAYS 일 */
export const defaultStatPeriod = (): { from: string; to: string } => {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - (STAT_DEFAULT_PERIOD_DAYS - 1));

  return { from: toScreenDate(from), to: toScreenDate(today) };
};

/** 입력값 → API 형식(yyyy-MM-dd). 점·슬래시가 들어와도 정규화한다 */
export const toStatApiDate = (value: string): string => value.trim().replace(/[./]/g, '-');

