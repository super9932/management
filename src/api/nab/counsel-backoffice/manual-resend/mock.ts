import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ManualResendRequest, ManualResendResultItem } from './dto';

export const manualResendHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.manualResend}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({ nabCuslManlDcmtIdList: [] }))) as ManualResendRequest;

    // 세 번째마다 이미 완료된 문서로 취급해 SKIPPED 경로도 볼 수 있게 한다
    const items: ManualResendResultItem[] = (body.nabCuslManlDcmtIdList ?? []).map((id, i) => {
      const skipped = i % 3 === 2;

      return {
        nabCuslManlDcmtId: id,
        result: skipped ? 'SKIPPED' : 'ENQUEUED',
        reason: skipped ? 'ALREADY_COMPLETED' : null,
      };
    });

    return HttpResponse.json({
      data: {
        requestedCount: items.length,
        enqueuedCount: items.filter((item) => item.result === 'ENQUEUED').length,
        skippedCount: items.filter((item) => item.result === 'SKIPPED').length,
        failedCount: 0,
        items,
      },
      message: 'OK',
    });
  }),
];
