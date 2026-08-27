import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';
import { eachDateDesc } from '../stats-message-daily/mock';

import type { StatsRecomputeRequest } from './dto';

export const statsRecomputeHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.statsRecompute}`, async ({ request }) => {
    const body = (await request.json()) as StatsRecomputeRequest;
    const days = eachDateDesc(body.from, body.to).length;

    return HttpResponse.json({
      data: {
        from: body.from,
        to: body.to,
        // 메시지 큐브는 축 조합만큼, 검색 큐브는 FP유형만큼 행이 쌓인다
        deletedMessageRows: body.message === false ? 0 : days * 80,
        deletedSearchRows: body.search === false ? 0 : days * 4,
      },
      message: 'OK',
    });
  }),
];
