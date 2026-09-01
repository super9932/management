import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { StipulationInitLoadRequest, StipulationInitLoadResultItem } from './dto';

export const stipulationInitLoadHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.stipulationInitLoad}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({ items: [] }))) as StipulationInitLoadRequest;

    // 세 번째마다 이미 적재된 키로 취급해 SKIPPED 경로도 화면에서 볼 수 있게 한다
    const items: StipulationInitLoadResultItem[] = (body.items ?? []).map((item, i) => {
      const skipped = i % 3 === 2;

      return {
        csvKey: item.csvKey,
        nabCuslIsrnStplDcmtId: skipped ? null : 700 + i,
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
