import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import { manuals } from '../manual-list/mock';
import type { ManualDetailRequest } from './dto';

export const manualDetailHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.manualDetail}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as ManualDetailRequest;
    const found = manuals.find((m) => m.nabCuslManlDcmtId === body.nabCuslManlDcmtId) ?? manuals[0];

    return HttpResponse.json({
      data: {
        ...found,
        fileUrlPathNm: `https://object-storage.mock.hanwhalife.com/counsel/manual/${found.nabCuslManlDcmtId}.docx?mock=true`,
        rgsrEmnb: '2230000',
        lastChnrNm: found.rgsrNm,
        lastChnrEmnb: '2230000',
        lastChnrOrgnNm: found.rgstOrgnNm,
        lastChngDttm: found.rgstDttm,
      },
      message: 'OK',
    });
  }),
];
