import type { CounselKillSwitchItem, YnFlag } from '../types';

/**
 * POST /v1/post/counsel/admin/killswitch/save — 점검 Kill-Switch 저장(upsert)
 *
 * 요청자(변경자) 사번 emnb 도 본문 필수 필드다 — service 가 withEmnb 로 채워 보낸다.
 */
export interface CounselKillSwitchSaveRequest {
  /** 기능점검코드 (예: COUNSEL_SERVICE) */
  ftreIspcCode: string;
  /** 기능점검코드명 (필수) */
  ftreIspcCodeNm: string;
  /** 점검수행여부. Y 로 저장하면 캐시 write-through 로 즉시 점검모드가 된다 */
  ispcAcmpYn: YnFlag;
}

export interface CounselKillSwitchSaveResponse {
  killSwitch: CounselKillSwitchItem;
  /** true = 신규 생성, false = 기존 갱신 */
  created: boolean;
}
