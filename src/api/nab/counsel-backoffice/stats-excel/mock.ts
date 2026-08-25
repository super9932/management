import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/** 실제 xlsx 대신 동일 MIME 의 더미 바이너리를 내려준다 */
export const statsExcelHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.statsMessageExcel}`, () =>
    HttpResponse.arrayBuffer(new TextEncoder().encode('mock-xlsx-binary').buffer, {
      headers: {
        'Content-Type': XLSX_MIME,
        'Content-Disposition': 'attachment; filename="counsel-message-stats.xlsx"',
      },
    })
  ),
];
