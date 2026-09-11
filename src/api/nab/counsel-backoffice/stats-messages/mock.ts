import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { MsgeStatItem, MsgeStatRequest } from './dto';

const SCREEN_CODES = ['01', '02', '03'];

export const msgeStats: MsgeStatItem[] = Array.from({ length: 35 }, (_, i) => {
  const day = String((i % 28) + 1).padStart(2, '0');
  // 5의 배수 턴은 사용자가 중지한 것으로 두어 답변 계열이 모두 null 인 케이스를 만든다
  const stopped = i % 5 === 0;

  return {
    rgstDttm: `2026-07-${day} 10:0${i % 10}:00`,
    fpUniqNo: `223020${i % 10}`,
    lvl1OrgnNm: '1사업본부',
    lvl2OrgnNm: '서울권역',
    lvl3OrgnNm: '서울지역단',
    lvl4OrgnNm: '서울지점',
    convRoomId: `550e8400-e29b-41d4-a716-4466554400${String(i).padStart(2, '0')}`,
    cuslSrvcTypeCode: SCREEN_CODES[i % SCREEN_CODES.length],
    rcmdQustId: i % 3 === 0 ? null : i + 1,
    qustCntn: `보험금 청구 방법 알려줘 (${i + 1})`,
    answCntn: stopped ? null : '청구서와 진단서를 준비해 앱에서 접수하시면 됩니다.',
    llmNm: stopped ? null : 'gemini-3-pro',
    rqrdTime: stopped ? null : Number((1.2 + (i % 7) * 0.37).toFixed(2)),
    costUsd: stopped ? null : Number((0.000123 * (i + 1)).toFixed(6)),
    fdbkLikeYn: i % 4 === 0 ? 'Y' : null,
    fdbkCmmt: i % 4 === 0 ? '설명이 명확했어요' : null,
    // 중지 턴은 참조 문서가 없고, 3턴에 한 번은 두 건을 참조한 케이스를 만든다
    manlDocList: stopped
      ? []
      : [
          {
            nabCuslManlDcmtId: 80 + i,
            nabCuslAdmrTypeCode: 'UDW',
            manlClsfCode: 'ONE_SHET',
            manlNm: `업무매뉴얼_반환 보험료의 전달 (${i + 1}).docx`,
            downloadUrl: null,
          },
          ...(i % 3 === 0
            ? [
                {
                  nabCuslManlDcmtId: 900 + i,
                  nabCuslAdmrTypeCode: 'ISRN_SVC' as const,
                  manlClsfCode: 'DPST' as const,
                  manlNm: `보험공통_입금 처리 안내 (${i + 1}).pdf`,
                  downloadUrl: null,
                },
              ]
            : []),
        ],
  };
});

export const statsMessagesHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.statsMessageList}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as MsgeStatRequest;
    const page = body.page ?? 1;
    const size = body.size ?? 10;
    const start = (page - 1) * size;

    return HttpResponse.json({
      data: { msgeStatList: msgeStats.slice(start, start + size) },
      message: 'OK',
      page: {
        number: page,
        size,
        totalElements: msgeStats.length,
        totalPages: Math.max(1, Math.ceil(msgeStats.length / size)),
      },
    });
  }),
];
