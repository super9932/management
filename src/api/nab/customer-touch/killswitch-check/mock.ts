import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import { killSwitches } from '../killswitch-list/mock';
import type { KillSwitchCheckRequest } from './dto';

export const killSwitchCheckHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.killSwitchCheck}`, async ({ request }) => {
    const body = (await request.json()) as KillSwitchCheckRequest;
    const enabled = Object.fromEntries(
      body.featureCodes.map((code) => [
        code,
        killSwitches.find((k) => k.featureCode === code)?.state === 'ENABLED',
      ])
    );
    return HttpResponse.json({ data: { enabled }, message: 'OK' });
  }),
];
