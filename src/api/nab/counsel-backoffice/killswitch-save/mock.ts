import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';
import { counselKillSwitches } from '../killswitch-fixture';

import type { CounselKillSwitchSaveRequest } from './dto';

export const counselKillSwitchSaveHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.killSwitchSave}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as CounselKillSwitchSaveRequest;
    const found = counselKillSwitches.find((item) => item.ftreIspcCode === body.ftreIspcCode);

    // 목도 실제처럼 상태를 유지해야 토글 후 재조회가 맞아떨어진다
    if (found) {
      found.ispcAcmpYn = body.ispcAcmpYn;
      found.ftreIspcCodeNm = body.ftreIspcCodeNm;
      found.lastChngDttm = '2026-09-01T01:00:00Z';
    }

    const killSwitch = found ?? {
      ftreIspcCode: body.ftreIspcCode,
      ftreIspcCodeNm: body.ftreIspcCodeNm,
      ispcAcmpYn: body.ispcAcmpYn,
      rgsrEmnb: '2140046',
      rgstDttm: '2026-09-01T01:00:00Z',
      lastChnrEmnb: '2140046',
      lastChngDttm: '2026-09-01T01:00:00Z',
    };

    if (!found) counselKillSwitches.push(killSwitch);

    return HttpResponse.json({ data: { killSwitch, created: !found }, message: 'OK' });
  }),
];
