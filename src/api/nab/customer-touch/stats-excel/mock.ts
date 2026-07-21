import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/** 실제 xlsx 대신 동일 MIME의 더미 바이너리를 내려준다. */
export const statsExcelHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.statsExcel}`, () =>
    HttpResponse.arrayBuffer(new TextEncoder().encode('mock-xlsx-binary').buffer, {
      headers: {
        'Content-Type': XLSX_MIME,
        'Content-Disposition': 'attachment; filename="touch-stats.xlsx"',
      },
    })
  ),
];
