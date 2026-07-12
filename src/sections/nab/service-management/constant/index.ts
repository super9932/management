import type { ServiceToggleItem, ServiceToggleState } from '../type';

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
