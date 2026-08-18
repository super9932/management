import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptGetRequest, PromptGetResponse } from './dto';

export const promptDetailMock: PromptGetResponse = {
  id: 1_001,
  type: 'message_style',
  category: '일반',
  name: '생일 축하 · 친근한 어조',
  content: [
    '[특징]',
    '고객의 이름을 반드시 포함하고, 보험 상품 권유 문구는 넣지 않는다.',
    '',
    '[예시]',
    '○○님, 생일 진심으로 축하드립니다. 오늘 하루 행복하게 보내세요!',
  ].join('\n'),
  characteristic: '고객의 이름을 반드시 포함하고, 보험 상품 권유 문구는 넣지 않는다.',
  example: '○○님, 생일 진심으로 축하드립니다. 오늘 하루 행복하게 보내세요!',
  hash: '9f3c9a1b2d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8',
  thresholds: { relevance: 4, tone: 3, safety: 5 },
  maxIterations: 3,
  registeredAt: '2026-06-10 09:12:44',
  updatedAt: '2026-07-10 14:22:01',
  lastChangerEmnb: '20180412',
  lastChanger: '김한화(20180412)',
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
