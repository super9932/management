import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptGetRequest, PromptGetResponse } from './dto';

export const promptDetailMock: PromptGetResponse = {
  id: 126,
  category: 'message_style',
  categoryLabel: '문자유형',
  item: '감성형',
  name: '문자유형 — 감성형',
  content: [
    '[특징]',
    '따뜻하고 공감하는 어조로, 고객의 상황에 대한 관심을 먼저 드러낸다.',
    '',
    '[예시]',
    '○○님, 환절기라 감기 조심하셔야 할 것 같아요. 늘 건강하시길 바랍니다.',
  ].join('\n'),
  characteristic: '따뜻하고 공감하는 어조로, 고객의 상황에 대한 관심을 먼저 드러낸다.',
  example: '○○님, 환절기라 감기 조심하셔야 할 것 같아요. 늘 건강하시길 바랍니다.',
  hash: '9f3c9a1b2d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8',
  registeredAt: '2026-08-14 10:02:11',
  updatedAt: '2026-08-20 11:41:03',
  lastChangerEmnb: '2240201',
  lastChanger: '김윤기(2240201)',
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
