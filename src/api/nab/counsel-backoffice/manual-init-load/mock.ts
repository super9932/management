import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ManualInitLoadRequest, ManualInitLoadResultItem } from './dto';

export const manualInitLoadHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.manualInitLoad}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({ items: [] }))) as ManualInitLoadRequest;

    // 세 번째마다 이미 적재된 키로 취급해 SKIPPED 경로도 화면에서 볼 수 있게 한다
    const items: ManualInitLoadResultItem[] = (body.items ?? []).map((item, i) => {
      const skipped = i % 3 === 2;

      return {
        key: item.key,
        nabCuslManlDcmtId: skipped ? null : 500 + i,
        result: skipped ? 'SKIPPED' : 'LOADED',
        reason: skipped ? 'ALREADY_LOADED' : null,
      };
    });

    return HttpResponse.json({
      data: {
        requestedCount: items.length,
        loadedCount: items.filter((item) => item.result === 'LOADED').length,
        skippedCount: items.filter((item) => item.result === 'SKIPPED').length,
        failedCount: items.filter((item) => item.result === 'FAILED').length,
        items,
      },
      message: 'OK',
    });
  }),
];
