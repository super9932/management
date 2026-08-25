import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

/** 등록 직후 상태는 항상 PENDING — 완료는 AI BE 콜백이 확정한다 */
export const manualSaveHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.manualSave}`, () =>
    HttpResponse.json({
      data: { nabCuslManlDcmtId: 900, status: 'PENDING' },
      message: 'OK',
    })
  ),
];
