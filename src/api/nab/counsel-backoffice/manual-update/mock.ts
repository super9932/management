import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ManualUpdateRequest } from './dto';

export const manualUpdateHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.manualUpdate}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as ManualUpdateRequest;

    return HttpResponse.json({
      data: { nabCuslManlDcmtId: body.nabCuslManlDcmtId, status: 'OPERATING' },
      message: 'OK',
    });
  }),
];
