import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import { categories } from '../category-list/mock';
import type { CategoryGetRequest } from './dto';

export const categoryGetHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.categoryGet}`, async ({ request }) => {
    const body = (await request.json()) as CategoryGetRequest;
    const found = categories.find((c) => c.cgryCode === body.cgryCode);

    if (!found) {
      return HttpResponse.json({
        error: { code: 'CGRY_NOT_FOUND', message: '존재하지 않는 카테고리입니다.' },
      });
    }
    return HttpResponse.json({ data: found, message: 'OK' });
  }),
];
