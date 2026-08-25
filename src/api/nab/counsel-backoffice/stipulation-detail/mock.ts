import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import { stipulations } from '../stipulation-list/mock';
import type { StipulationDetailRequest } from './dto';

export const stipulationDetailHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.stipulationDetail}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as StipulationDetailRequest;
    const found =
      stipulations.find((s) => s.nabCuslIsrnStplDcmtId === body.nabCuslIsrnStplDcmtId) ?? stipulations[0];

    return HttpResponse.json({
      data: {
        ...found,
        pdfDcmtUrlPathNm: `https://object-storage.mock.hanwhalife.com/counsel/stpl/${found.nabCuslIsrnStplDcmtId}.pdf?mock=true`,
        csvDcmtUrlPathNm: `https://object-storage.mock.hanwhalife.com/counsel/stpl/${found.nabCuslIsrnStplDcmtId}.csv?mock=true`,
        rgsrEmnb: '2230000',
      },
      message: 'OK',
    });
  }),
];
