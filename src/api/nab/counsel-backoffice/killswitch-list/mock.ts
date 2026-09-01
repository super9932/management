import { http, HttpResponse } from 'msw';

import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { CounselKillSwitchItem } from '../types';
import type { CounselKillSwitchListRequest } from './dto';

/** 목록/상세/저장 목이 같은 원본을 공유한다 */
export const counselKillSwitches: CounselKillSwitchItem[] = [
  {
    ftreIspcCode: 'COUNSEL_SERVICE',
    ftreIspcCodeNm: '상담AI 서비스',
    ispcAcmpYn: 'N',
    rgsrEmnb: '2220030',
    rgstDttm: '2026-07-01 09:00:00',
    lastChnrEmnb: '2220030',
    lastChngDttm: '2026-08-01 14:20:00',
  },
  {
    ftreIspcCode: 'COUNSEL_MANUAL_SEARCH',
    ftreIspcCodeNm: '매뉴얼 검색',
    ispcAcmpYn: 'N',
    rgsrEmnb: '2220030',
    rgstDttm: '2026-07-01 09:00:00',
    lastChnrEmnb: '2140046',
    lastChngDttm: '2026-08-10 11:05:00',
  },
  {
    ftreIspcCode: 'COUNSEL_STIPULATION_SEARCH',
    ftreIspcCodeNm: '약관 검색',
    ispcAcmpYn: 'Y',
    rgsrEmnb: '2220030',
    rgstDttm: '2026-07-01 09:00:00',
    lastChnrEmnb: '2140046',
    lastChngDttm: '2026-08-22 17:40:00',
  },
];

export const counselKillSwitchListHandlers = [
  http.post(`/api${NAB_COUNSEL_BACKOFFICE_API.killSwitchList}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as CounselKillSwitchListRequest;
    const keyword = body.keyword?.trim().toLowerCase();

    const list = keyword
      ? counselKillSwitches.filter(
          (item) =>
            item.ftreIspcCode.toLowerCase().includes(keyword) ||
            item.ftreIspcCodeNm.toLowerCase().includes(keyword)
        )
      : counselKillSwitches;

    return HttpResponse.json({ data: { killSwitches: list }, message: 'OK' });
  }),
];
