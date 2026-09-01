import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { AdminTypeCode, ManualClassCode, ManualStatus } from '../types';
import type { ManualItem, ManualListRequest } from './dto';

const ADMIN_TYPES: AdminTypeCode[] = ['UDW', 'ISRN_ADT', 'ISRN_SVC'];
const STATUSES: ManualStatus[] = ['OPERATING', 'PENDING', 'NOT_OPERATING', 'ERROR'];
/** 관리주체별 분류 후보 — 실제 API 도 관리주체 하위 코드만 허용한다 */
const CLASS_CODES: Record<AdminTypeCode, ManualClassCode[]> = {
  UDW: ['ONE_SHET', 'BSWR_MANL'],
  ISRN_ADT: ['ISRN_UNDN'],
  ISRN_SVC: ['PLAN', 'DPST', 'RE_OTPY', 'CTCN', 'CNTR_SUPT'],
};

const ORGN_NAMES: Record<AdminTypeCode, string> = {
  UDW: '언더라이팅팀',
  ISRN_ADT: '보험심사팀',
  ISRN_SVC: '보험서비스팀',
};

/** 관리주체별 8건씩 — 목록/상세/이력 목이 같은 원본을 공유한다 */
export const manuals: ManualItem[] = ADMIN_TYPES.flatMap((adminType, typeIndex) =>
  Array.from({ length: 8 }, (_, i) => {
    const seq = typeIndex * 8 + i;
    const day = String((i % 28) + 1).padStart(2, '0');
    const status = STATUSES[i % STATUSES.length];

    return {
      nabCuslManlDcmtId: 100 + seq,
      manlNm: `${ORGN_NAMES[adminType]}_업무매뉴얼_v${i + 1}.docx`,
      nabCuslAdmrTypeCode: adminType,
      // 첫 건은 분류 도입 이전 등록분(null)을 재현한다
      manlClsfCode: i === 0 ? null : CLASS_CODES[adminType][i % CLASS_CODES[adminType].length],
      valdStarDttm: `2026-08-${day} 00:00:00`,
      // 짝수 건은 종료일 없이 무기한으로 둔다
      valdEndDttm: i % 2 === 0 ? null : `2026-12-${day} 23:59:59`,
      status,
      rgstOrgnNm: ORGN_NAMES[adminType],
      rgsrNm: '김한화',
      rgstDttm: `2026-07-${day} 09:30:00`,
    };
  })
);

export const manualListHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.manualList}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as ManualListRequest;

    let list = manuals.filter((m) => m.nabCuslAdmrTypeCode === body.nabCuslAdmrTypeCode);
    if (body.manlClsfCode) list = list.filter((m) => m.manlClsfCode === body.manlClsfCode);
    if (body.status) list = list.filter((m) => m.status === body.status);
    if (body.keyword) {
      const keyword = body.keyword.trim().toLowerCase();
      list = list.filter((m) => m.manlNm.toLowerCase().includes(keyword));
    }

    const page = body.page ?? 1;
    const size = body.size ?? 10;
    const start = (page - 1) * size;

    return HttpResponse.json({
      data: { manlDocList: list.slice(start, start + size) },
      message: 'OK',
      page: {
        number: page,
        size,
        totalElements: list.length,
        totalPages: Math.max(1, Math.ceil(list.length / size)),
      },
    });
  }),
];
