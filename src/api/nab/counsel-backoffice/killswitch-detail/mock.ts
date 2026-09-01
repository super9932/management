import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';
import { counselKillSwitches } from '../killswitch-list/mock';

import type { CounselKillSwitchDetailRequest } from './dto';

export const counselKillSwitchDetailHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.killSwitchDetail}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as CounselKillSwitchDetailRequest;
    const found = counselKillSwitches.find((item) => item.ftreIspcCode === body.ftreIspcCode);

    if (!found) {
      return HttpResponse.json(
        { data: null, error: { code: 'NOT_FOUND', message: '존재하지 않는 기능코드입니다.' } },
        { status: 404 }
      );
    }

    return HttpResponse.json({ data: { killSwitch: found }, message: 'OK' });
  }),
];
