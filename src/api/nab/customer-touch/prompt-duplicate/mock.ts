import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import { prompts } from '../prompt-list/mock';
import type { PromptDuplicateRequest } from './dto';

export const promptDuplicateHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptDuplicate}`, async ({ request }) => {
    const body = (await request.json()) as PromptDuplicateRequest;
    const found = prompts.find((p) => p.category === body.category && p.item === body.item);

    return HttpResponse.json({
      data: { duplicate: Boolean(found) && found?.id !== body.excludeId },
      message: 'OK',
    });
  }),
];
