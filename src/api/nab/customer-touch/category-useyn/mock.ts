import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import { categories } from '../category-list/mock';
import type { CategoryUseYnRequest } from './dto';

export const categoryUseYnHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.categoryUseYn}`, async ({ request }) => {
    const body = (await request.json()) as CategoryUseYnRequest;
    const target = categories.find((c) => c.cgryCode === body.cgryCode);
    if (target) target.useYn = body.useYn;

    return HttpResponse.json({
      data: { id: categories.findIndex((c) => c.cgryCode === body.cgryCode) + 1 },
      message: 'OK',
    });
  }),
];
