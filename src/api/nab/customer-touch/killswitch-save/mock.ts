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
          updatedBy: '21914014',
          updatedAt: '2026-08-18T05:32:10Z',
          createdAt: '2026-06-02T01:12:33Z',
        },
        created: false,
      },
      message: 'OK',
    });
  }),
];
