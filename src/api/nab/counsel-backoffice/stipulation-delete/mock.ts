import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { StipulationDeleteRequest } from './dto';

export const stipulationDeleteHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.stipulationDelete}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as StipulationDeleteRequest;
    const ids = [...new Set(body.nabCuslIsrnStplDcmtIdList ?? [])];

    return HttpResponse.json({
      data: { deletedCount: ids.length, failedList: [] },
      message: 'OK',
    });
  }),
];
