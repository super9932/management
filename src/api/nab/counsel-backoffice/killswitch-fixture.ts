import type { CounselKillSwitchItem } from './types';

/**
 * 킬스위치 목 데이터 — 상세·저장·체크 핸들러가 함께 쓰는 씨앗 값이다.
 * 목록 API 모듈을 걷어내면서 픽스처만 남겼다.
 */
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
