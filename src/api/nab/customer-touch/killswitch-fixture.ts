import type { KillSwitchItem } from './types';

/**
 * 킬스위치 목 데이터 — 상세·저장·체크 핸들러가 함께 쓰는 씨앗 값이다.
 * 목록 API 모듈을 걷어내면서 픽스처만 남겼다.
 */
export const killSwitches: KillSwitchItem[] = [
  {
    featureCode: 'AI_MESSAGE_GENERATION',
    featureName: 'AI 메시지 생성',
    state: 'ENABLED',
    description: '고객터치 메시지 생성 기능 전체',
    updatedBy: '21914014',
    updatedAt: '2026-07-12T15:04:11',
    createdAt: '2026-05-02T09:00:00',
  },
  {
    featureCode: 'AI_CONTENT_SEARCH',
    featureName: '컨텐츠 검색',
    state: 'ENABLED',
    description: 'APB 색인 기반 컨텐츠 검색',
    updatedBy: '21914014',
    updatedAt: '2026-07-01T10:12:45',
    createdAt: '2026-05-02T09:00:00',
  },
  {
    featureCode: 'AI_CUSTOMER_RECOMMEND',
    featureName: 'AI 추천 고객',
    state: 'DISABLED',
    description: '점검 중 일시 중단',
    updatedBy: '21914014',
    updatedAt: '2026-07-13T08:30:00',
    createdAt: '2026-05-02T09:00:00',
  },
  {
    featureCode: 'AI_STATS_AGGREGATE',
    featureName: '통계 재집계 배치',
    state: 'ENABLED',
    description: '일배치 통계 집계',
    updatedBy: '21914014',
    updatedAt: '2026-06-20T02:00:00',
    createdAt: '2026-05-02T09:00:00',
  },
];
