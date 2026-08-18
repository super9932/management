import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ContentNahUpdateRequest } from './dto';

export const contentNahUpdateHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.contentNahUpdate}`, async ({ request }) => {
    const body = (await request.json()) as ContentNahUpdateRequest;
    return HttpResponse.json({
      data: { contentId: body.contentId, ok: true, contentStatus: 'updating' },
      message: 'OK',
    });
  }),
];
