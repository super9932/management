import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { StatsSummaryResponse } from './dto';

export const statsSummaryMock: StatsSummaryResponse = {
  generateCount: 12_480,
  sendCount: 9_312,
  readCount: 6_907,
  searchCount: 21_045,
  customerCount: 3_186,
};

export const statsSummaryHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.statsSummary}`, () =>
    HttpResponse.json({ data: statsSummaryMock, message: 'OK' })
  ),
];
