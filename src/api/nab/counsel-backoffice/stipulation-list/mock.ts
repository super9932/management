import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { StipulationStatus } from '../types';
import type { StipulationItem, StipulationListRequest } from './dto';

const STATUSES: StipulationStatus[] = ['ERROR', 'PENDING', 'OPERATING'];

export const stipulations: StipulationItem[] = Array.from({ length: 37 }, (_, i) => {
  const status = STATUSES[i % 3 === 0 ? i % 3 : 2];
  const day = String((i % 28) + 1).padStart(2, '0');

  return {
    nabCuslIsrnStplDcmtId: 1_000 + i,
    pdfDcmtFileNm: `한화생명 프라임통합종신보험(무)_1818-0${27 + (i % 20)}~050_약관.pdf`,
    csvDcmtFileNm: `한화생명 프라임통합종신보험(무)_1818-0${27 + (i % 20)}~050_약관.csv`,
    // 처리중·오류 문서는 전처리 전이라 보종세목코드가 비어 있다
    isrnKindCodeList: status === 'OPERATING'
      ? ['1818-027', '1818-028', '1818-029', '1818-030', '1818-031']
      : [],
    saleStarDate: '2008-04-01',
    saleEndDate: '2008-06-30',
    status,
    rgstOrgnNm: '상품시스템팀',
    rgsrNm: '김한화',
    rgstDttm: `2026-06-${day} 10:00:00`,
  };
});

export const stipulationListHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.stipulationList}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as StipulationListRequest;
    let list = stipulations;

    if (body.status) list = list.filter((doc) => doc.status === body.status);
    // 판매일자가 비어 있는(전처리 전) 문서는 판매기간 조건과 무관하게 남긴다
    if (body.saleStarDate) {
      list = list.filter((doc) => !doc.saleStarDate || doc.saleStarDate >= body.saleStarDate!);
    }
    if (body.saleEndDate) {
      list = list.filter((doc) => !doc.saleEndDate || doc.saleEndDate <= body.saleEndDate!);
    }
    if (body.keyword) {
      const keyword = body.keyword.trim().toLowerCase();
      list = list.filter((doc) =>
        body.searchType === 'ISRN_KIND_CODE'
          ? doc.isrnKindCodeList.some((code) => code.toLowerCase().startsWith(keyword))
          : doc.pdfDcmtFileNm.toLowerCase().includes(keyword)
      );
    }

    const page = body.page ?? 1;
    const size = body.size ?? 10;
    const start = (page - 1) * size;

    return HttpResponse.json({
      data: { stplDocList: list.slice(start, start + size) },
      message: 'OK',
      page: {
        number: page,
        size,
        totalElements: list.length,
        totalPages: Math.ceil(list.length / size),
      },
    });
  }),
];
