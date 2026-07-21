import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { MessageRow, StatsMessagesRequest } from './dto';

const TONES = ['FRIENDLY', 'FORMAL', 'CASUAL'];
const SITUATIONS = ['BIRTHDAY', 'CONTRACT_ANNIV', 'SEASONAL'];
const RELATIONSHIPS = ['NEW', 'LONGTERM', 'VIP'];
const INTERESTS = ['HEALTH', 'ASSET', 'TRAVEL', 'FAMILY'];

export const messageRows: MessageRow[] = Array.from({ length: 137 }, (_, i) => ({
  fpUniqNo: `FP${String(100_000 + i).padStart(8, '0')}`,
  custId: `CUST${String(i + 1).padStart(6, '0')}`,
  cuosCntsId: 5_000 + i,
  toneCode: TONES[i % TONES.length],
  situationCode: SITUATIONS[i % SITUATIONS.length],
  relationshipCode: RELATIONSHIPS[i % RELATIONSHIPS.length],
  interestCode: INTERESTS[i % INTERESTS.length],
  msgeCntn: `고객님, 늘 건강하고 행복한 하루 보내시길 바랍니다. (샘플 메시지 #${i + 1})`,
  gnrtDttm: `2026-07-${String((i % 28) + 1).padStart(2, '0')}T09:30:00`,
}));

export const statsMessagesHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.statsMessages}`, async ({ request }) => {
    const body = (await request.json()) as StatsMessagesRequest;
    const pageNum = Number(body.pageNum) || 1;
    const pageSize = Number(body.pageSize) || 20;
    const start = (pageNum - 1) * pageSize;
    const list = messageRows.slice(start, start + pageSize);
    const totalPages = Math.ceil(messageRows.length / pageSize);

    return HttpResponse.json({
      data: {
        pagination: {
          pageNum,
          pageSize,
          totalElements: messageRows.length,
          totalPages,
          prev: pageNum > 1,
          next: pageNum < totalPages,
        },
        list,
      },
      message: 'OK',
    });
  }),
];
