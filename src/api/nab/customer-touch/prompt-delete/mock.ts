import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptDeleteRequest } from './dto';

export const promptDeleteHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptDelete}`, async ({ request }) => {
    const body = (await request.json()) as PromptDeleteRequest;
    return HttpResponse.json({ data: { id: body.id }, message: 'OK' });
  }),
];
