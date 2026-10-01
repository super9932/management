import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import { killSwitches } from '../killswitch-fixture';
import type { KillSwitchCheckRequest } from './dto';

export const killSwitchCheckHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.killSwitchCheck}`, async ({ request }) => {
    const body = (await request.json()) as KillSwitchCheckRequest;
    const enabled = Object.fromEntries(
      body.featureCodes.map((code) => [
        code,
        // 미등록 코드도 true(fail-open) — 명시적 DISABLED 행만 false
        killSwitches.find((k) => k.featureCode === code)?.state !== 'DISABLED',
      ])
    );
    return HttpResponse.json({ data: { enabled }, isSuccess: true, message: null });
  }),
];
