import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { StatsAggregateRequest } from './dto';

export const statsAggregateHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.statsAggregate}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as StatsAggregateRequest;
    return HttpResponse.json({
      data: {
        from: body.from ?? '2026-07-06',
        to: body.to ?? '2026-07-13',
      },
      message: 'OK',
    });
  }),
];
