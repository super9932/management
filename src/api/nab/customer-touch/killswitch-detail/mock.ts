import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import { killSwitches } from '../killswitch-list/mock';
import type { KillSwitchDetailRequest } from './dto';

export const killSwitchDetailHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.killSwitchDetail}`, async ({ request }) => {
    const body = (await request.json()) as KillSwitchDetailRequest;
    const found = killSwitches.find((k) => k.featureCode === body.featureCode);

    if (!found) {
      return HttpResponse.json({
        error: { code: 'KS_NOT_FOUND', message: '존재하지 않는 기능코드입니다.' },
      });
    }
    return HttpResponse.json({ data: { killSwitch: found }, message: 'OK' });
  }),
];
