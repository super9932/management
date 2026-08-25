import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ManualDeleteRequest } from './dto';

export const manualDeleteHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.manualDelete}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as ManualDeleteRequest;
    const ids = [...new Set(body.nabCuslManlDcmtIdList ?? [])];

    return HttpResponse.json({
      data: { deletedCount: ids.length, failedList: [] },
      message: 'OK',
    });
  }),
];
