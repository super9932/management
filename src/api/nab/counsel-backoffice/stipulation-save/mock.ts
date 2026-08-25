import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

/** 등록 직후 상태는 항상 PENDING — 완료·오류 확정은 AI BE 콜백이 담당한다 */
export const stipulationSaveHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.stipulationSave}`, () =>
    HttpResponse.json({
      data: { nabCuslIsrnStplDcmtId: 1025, status: 'PENDING' },
      message: 'OK',
    })
  ),
];
