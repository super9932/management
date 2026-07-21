import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

let nextCategoryId = 200;

export const categoryCreateHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.categoryCreate}`, () => {
    nextCategoryId += 1;
    return HttpResponse.json({ data: { id: nextCategoryId }, message: 'OK' });
  }),
];
