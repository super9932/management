import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptGetRequest, PromptGetResponse } from './dto';

export const promptDetailMock: PromptGetResponse = {
  id: 1_001,
  name: '생일 축하 · 친근한 어조',
  categoryCode: 'GREETING',
  toneCode: 'FRIENDLY',
  situationCode: 'BIRTHDAY',
  relationshipCode: 'LONGTERM',
  interestCode: 'FAMILY',
  extraGuide: '고객의 이름을 반드시 포함하고, 보험 상품 권유 문구는 넣지 않는다.',
  updatedAt: '2026-07-10 14:22:01',
  useYn: 'Y',
};

export const promptGetHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptGet}`, async ({ request }) => {
    const body = (await request.json()) as PromptGetRequest;
    return HttpResponse.json({
      data: { ...promptDetailMock, id: body.id },
      message: 'OK',
    });
  }),
];
