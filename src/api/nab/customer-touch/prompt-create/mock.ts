import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

let nextPromptId = 1_001;

export const promptCreateHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptCreate}`, () => {
    nextPromptId += 1;
    return HttpResponse.json({ data: { id: nextPromptId }, message: 'OK' });
  }),
];
