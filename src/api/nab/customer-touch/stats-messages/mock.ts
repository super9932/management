import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { MessageRow, StatsMessagesRequest } from './dto';

const TONES = ['공손한', '친근한', '간결한'];
const SITUATIONS = ['생일', '계약기념일', '환절기'];
const RELATIONSHIPS = ['계약고객', '가망고객', 'VIP'];
const INTERESTS = ['헬스/뷰티', '재테크', '여행', '육아'];

export const messageRows: MessageRow[] = Array.from({ length: 137 }, (_, i) => {
  const isEdit = i % 3 === 0;

  return {
    msgeGnrtId: 1_000 + i,
    fpUniqNo: `21${String(40_050 + i).padStart(5, '0')}`,
    custId: String(2_053_800 + i).padStart(10, '0'),
    entryPointCode: 'TEXT_MESSAGE',
    generationTypeCode: isEdit ? 'EDIT' : 'CREATE',
    prevMsgeGnrtId: isEdit ? 999 + i : null,
    cuosCntsId: i % 4 === 0 ? 5_000 + i : null,
    toneCode: TONES[i % TONES.length],
    situationCode: SITUATIONS[i % SITUATIONS.length],
    relationshipCode: RELATIONSHIPS[i % RELATIONSHIPS.length],
    interestCode: INTERESTS[i % INTERESTS.length],
    msgeCntn: `고객님, 늘 건강하고 행복한 하루 보내시길 바랍니다. (샘플 메시지 #${i + 1})`,
    gnrtDttm: `2026-08-${String((i % 28) + 1).padStart(2, '0')}T09:30:00`,
  };
});

export const statsMessagesHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.statsMessages}`, async ({ request }) => {
    const body = (await request.json()) as StatsMessagesRequest;
    const pageNum = Number(body.pageNum) || 1;
    const pageSize = Number(body.pageSize) || 100;
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
