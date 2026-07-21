import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { KillSwitchSaveRequest } from './dto';

export const killSwitchSaveHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.killSwitchSave}`, async ({ request }) => {
    const body = (await request.json()) as KillSwitchSaveRequest;
    return HttpResponse.json({
      data: {
        killSwitch: {
          featureCode: body.featureCode,
          featureName: body.featureName ?? body.featureCode,
          state: body.state,
          description: body.description ?? '',
          updatedBy: body.updatedBy ?? 'admin',
          updatedAt: '2026-07-13T11:20:00',
          createdAt: '2026-06-01T09:00:00',
        },
        created: false,
      },
      message: 'OK',
    });
  }),
];
