import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';
import { eachDateDesc } from '../stats-message-daily/mock';

import type { SearchStatsRow, StatsSearchDailyRequest } from './dto';

const toRow = (statDate: string, index: number): SearchStatsRow => ({
  statDate,
  fpUvCount: 5 + (index % 6),
  searchCount: 28 + (index % 17),
});

export const statsSearchDailyHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.statsSearchDaily}`, async ({ request }) => {
    const body = (await request.json()) as StatsSearchDailyRequest;
    const dates = eachDateDesc(body.from, body.to);
    const pageNum = Number(body.pageNum) || 1;
    const pageSize = Number(body.pageSize) || 10;
    const start = (pageNum - 1) * pageSize;
    const totalPages = Math.ceil(dates.length / pageSize);

    return HttpResponse.json({
      data: {
        // 총 건수는 큐브 행 수가 아니라 조회 기간의 일수다
        pagination: {
          pageNum,
          pageSize,
          totalElements: dates.length,
          totalPages,
          prev: pageNum > 1,
          next: pageNum < totalPages,
        },
        list: dates.slice(start, start + pageSize).map((date, i) => toRow(date, start + i)),
      },
      message: 'OK',
    });
  }),
];
