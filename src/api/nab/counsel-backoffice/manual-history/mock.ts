import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ManualHistoryItem, ManualHistoryRequest } from './dto';

const history: ManualHistoryItem[] = [
  {
    chngClmnId: 'VALD_STAR_DTTM',
    chngBefoVal: '2026-08-01 00:00:00',
    chngAftrVal: '2026-09-01 00:00:00',
    rgstOrgnNm: '언더라이팅팀',
    rgsrNm: '김한화',
    chnrEmnb: '2190099',
    aplyDttm: '2026-07-27 14:00:00',
  },
  {
    // 종료일시를 지워 무기한으로 바꾼 사례
    chngClmnId: 'VALD_END_DTTM',
    chngBefoVal: '2026-12-31 23:59:59',
    chngAftrVal: null,
    rgstOrgnNm: '언더라이팅팀',
    rgsrNm: '이생명',
    chnrEmnb: '2220258',
    aplyDttm: '2026-07-20 09:10:00',
  },
];

export const manualHistoryHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.manualHistoryList}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as ManualHistoryRequest;
    const page = body.page ?? 1;
    const size = body.size ?? 10;
    const start = (page - 1) * size;

    return HttpResponse.json({
      data: { historyList: history.slice(start, start + size) },
      message: 'OK',
      page: {
        number: page,
        size,
        totalElements: history.length,
        totalPages: Math.max(1, Math.ceil(history.length / size)),
      },
    });
  }),
];
