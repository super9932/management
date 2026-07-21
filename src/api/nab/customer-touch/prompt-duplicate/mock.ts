import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptDuplicateRequest } from './dto';

/** 중복 팝업을 확인할 수 있도록 이 조합만 중복으로 처리한다. */
const DUPLICATED_COMBO = 'GREETING|FRIENDLY|BIRTHDAY|LONGTERM|FAMILY';

export const promptDuplicateHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptDuplicate}`, async ({ request }) => {
    const b = (await request.json()) as PromptDuplicateRequest;
    const combo = [
      b.categoryCode,
      b.toneCode,
      b.situationCode,
      b.relationshipCode,
      b.interestCode,
    ].join('|');
    return HttpResponse.json({
      data: { duplicate: combo === DUPLICATED_COMBO && b.excludeId !== 1_001 },
      message: 'OK',
    });
  }),
];
