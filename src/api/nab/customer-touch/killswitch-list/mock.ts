import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { KillSwitchListRequest } from './dto';
import type { KillSwitchItem } from '../types';

export const killSwitches: KillSwitchItem[] = [
  {
    featureCode: 'TOUCH_MESSAGE_GENERATE',
    featureName: 'AI 메시지 생성',
    state: 'ENABLED',
    description: '고객터치 메시지 생성 기능 전체',
    updatedBy: 'admin',
    updatedAt: '2026-07-12T15:04:11',
    createdAt: '2026-05-02T09:00:00',
  },
  {
    featureCode: 'TOUCH_CONTENT_SEARCH',
    featureName: '컨텐츠 검색',
    state: 'ENABLED',
    description: 'APB 색인 기반 컨텐츠 검색',
    updatedBy: 'admin',
    updatedAt: '2026-07-01T10:12:45',
    createdAt: '2026-05-02T09:00:00',
  },
  {
    featureCode: 'TOUCH_CUSTOMER_RECOMMEND',
    featureName: 'AI 추천 고객',
    state: 'DISABLED',
    description: '점검 중 일시 중단',
    updatedBy: 'operator',
    updatedAt: '2026-07-13T08:30:00',
    createdAt: '2026-05-02T09:00:00',
  },
  {
    featureCode: 'TOUCH_STATS_AGGREGATE',
    featureName: '통계 재집계 배치',
    state: 'ENABLED',
    description: '일배치 통계 집계',
    updatedBy: 'admin',
    updatedAt: '2026-06-20T02:00:00',
    createdAt: '2026-05-02T09:00:00',
  },
];

export const killSwitchListHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.killSwitchList}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as KillSwitchListRequest;
    const keyword = body.keyword?.trim().toLowerCase();
    const list = keyword
      ? killSwitches.filter(
          (k) =>
            k.featureCode.toLowerCase().includes(keyword) ||
            k.featureName.toLowerCase().includes(keyword)
        )
      : killSwitches;
    return HttpResponse.json({ data: { killSwitches: list }, message: 'OK' });
  }),
];
