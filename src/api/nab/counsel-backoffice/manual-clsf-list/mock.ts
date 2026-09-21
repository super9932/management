import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ManualClsfItem } from './dto';

/** 서버 분류 목록과 같은 순서·표기 */
const manlClsfList: ManualClsfItem[] = [
  { manlClsfCode: 'ONE_SHET', manlClsfNm: '원시트', nabCuslAdmrTypeCode: 'UDW' },
  { manlClsfCode: 'BSWR_MANL', manlClsfNm: '업무매뉴얼', nabCuslAdmrTypeCode: 'UDW' },
  { manlClsfCode: 'PLAN', manlClsfNm: '기획', nabCuslAdmrTypeCode: 'ISRN_SVC' },
  { manlClsfCode: 'DPST', manlClsfNm: '입금', nabCuslAdmrTypeCode: 'ISRN_SVC' },
  { manlClsfCode: 'RE_OTPY', manlClsfNm: '재지급', nabCuslAdmrTypeCode: 'ISRN_SVC' },
  { manlClsfCode: 'CTCN', manlClsfNm: '계약변경', nabCuslAdmrTypeCode: 'ISRN_SVC' },
  { manlClsfCode: 'CNTR_SUPT', manlClsfNm: '센터지원', nabCuslAdmrTypeCode: 'ISRN_SVC' },
  { manlClsfCode: 'ISRN_UNDN', manlClsfNm: '심사', nabCuslAdmrTypeCode: 'ISRN_ADT' },
];

export const manualClsfListHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.manualClsfList}`, () =>
    HttpResponse.json({ data: { manlClsfList }, message: 'OK' })
  ),
];
