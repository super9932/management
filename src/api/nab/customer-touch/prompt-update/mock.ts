import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptUpdateRequest } from './dto';

export const promptUpdateHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptUpdate}`, async ({ request }) => {
    const body = (await request.json()) as PromptUpdateRequest;
    return HttpResponse.json({ data: { id: body.id }, message: 'OK' });
  }),
];
