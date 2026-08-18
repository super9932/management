import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ContentNahGetRequest, ContentNahGetResponse } from './dto';

export const contentNahDetailMock: ContentNahGetResponse = {
  contentId: '5001',
  title: '환절기 건강관리 체크리스트',
  subtitle: '일교차가 큰 계절, 이렇게 대비하세요',
  displayTitle: '환절기 건강관리 체크리스트',
  description: '환절기 면역력 관리 방법과 생활 습관을 정리한 콘텐츠입니다.',
  contentStatus: 'created',
  categoryKind: '건강',
  categoryKindDetail: '생활건강',
  keywordPairs: [
    { category: '건강', name: '면역력' },
    { category: '시즌', name: '환절기' },
  ],
  bodyText: '환절기에는 체온 유지와 충분한 수분 섭취가 중요합니다. ...',
  imageUrls: ['https://cdn.example.com/nah/5001/thumb.png'],
  ocrText: '환절기 건강관리 체크리스트',
  publishStart: '2026-07-01',
  publishEnd: '2026-12-31',
  useYn: 'Y',
};

export const contentNahGetHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.contentNahGet}`, async ({ request }) => {
    const body = (await request.json()) as ContentNahGetRequest;
    return HttpResponse.json({
      data: { ...contentNahDetailMock, contentId: body.contentId },
      message: 'OK',
    });
  }),
];
