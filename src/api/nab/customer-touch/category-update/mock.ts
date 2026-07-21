import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

export const categoryUpdateHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.categoryUpdate}`, () =>
    HttpResponse.json({ data: { id: 200 }, message: 'OK' })
  ),
];
