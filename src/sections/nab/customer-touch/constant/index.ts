import type { PromptRow, ServiceToggleItem, ServiceToggleState, StatRow } from '../type';

// ---------------------------------------------------------------- 프롬프트 관리
export const MOCK_ROWS: PromptRow[] = Array.from({ length: 10 }, (_, i) => ({
  no: 63 - i,
  contentsId: '0000',
  type: '유형',
  category: '카테고리',
  promptName: '작성한 프롬프트명 노출',
  registeredAt: '2026-09-25',
  updatedAt: '2026-10-15',
  lastEditor: '2190063',
}));

// ---------------------------------------------------------------- 서비스 관리
export const SERVICE_TOGGLES: ServiceToggleItem[] = [
  {
    key: 'aiMessage',
    label: 'AI 메시지 생성',
    helper: 'OFF 설정 시 어드민 등록된 기본 발송 메시지로 대체, [문자하기] 버튼 클릭 시 FP 직접 입력 없이 문자앱 바로 호출',
  },
  {
    key: 'aiContentSearch',
    label: 'AI 콘텐츠 검색',
    helper: 'OFF 설정 시 기존 콘텐츠 키워드 검색으로 대체',
  },
  {
    key: 'aiRecommend',
    label: 'AI 고객 추천',
    helper: 'OFF 설정 시 진입 플로팅 버튼 미노출',
  },
];

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
