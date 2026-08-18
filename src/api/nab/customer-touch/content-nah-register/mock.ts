import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ContentNahRegisterRequest } from './dto';

export const contentNahRegisterHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.contentNahRegister}`, async ({ request }) => {
    const body = (await request.json()) as ContentNahRegisterRequest;
    return HttpResponse.json({
      data: { contentId: body.contentId, ok: true, contentStatus: 'processing' },
      message: 'OK',
    });
  }),
];
