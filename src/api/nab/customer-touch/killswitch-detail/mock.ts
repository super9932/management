import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import { killSwitches } from '../killswitch-fixture';
import type { KillSwitchDetailRequest } from './dto';

export const killSwitchDetailHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.killSwitchDetail}`, async ({ request }) => {
    const body = (await request.json()) as KillSwitchDetailRequest;
    const found = killSwitches.find((k) => k.featureCode === body.featureCode);

    if (!found) {
      // 미등록 기능코드는 HTTP 200 + error 봉투다
      return HttpResponse.json({
        isSuccess: true,
        data: null,
        error: {
          code: 'nxl-nab-ks-erro-001',
          message: '해당 기능의 Kill-Switch 정보를 찾을 수 없습니다.',
          details: [],
        },
      });
    }
    return HttpResponse.json({ data: { killSwitch: found }, isSuccess: true, message: null });
  }),
];
