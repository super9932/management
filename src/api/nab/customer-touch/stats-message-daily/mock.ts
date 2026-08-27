import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { MessageStatsRow, StatsMessageDailyRequest } from './dto';

/** toISOString 은 UTC 로 밀려 하루 어긋나므로 로컬 기준으로 찍는다 */
const toIsoDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};

/** from~to 의 모든 날짜를 최신순으로 — 서버도 집계 없는 날을 0 행으로 채워 내려준다 */
export const eachDateDesc = (from: string, to: string): string[] => {
  const start = new Date(`${from}T00:00:00`);
  const day = new Date(`${to}T00:00:00`);
  const dates: string[] = [];

  while (day >= start) {
    dates.push(toIsoDate(day));
    day.setDate(day.getDate() - 1);
  }

  return dates;
};

const toRow = (statDate: string, index: number): MessageStatsRow => ({
  statDate,
  fpUvCount: 8 + (index % 7),
  generateCount: 24 + (index % 13),
  modifyCount: 4 + (index % 5),
  sendCount: 15 + (index % 9),
  sendCustomerUvCount: 12 + (index % 6),
});

export const statsMessageDailyHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.statsMessageDaily}`, async ({ request }) => {
    const body = (await request.json()) as StatsMessageDailyRequest;
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
