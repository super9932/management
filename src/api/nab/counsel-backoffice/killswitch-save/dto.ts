import type { CounselKillSwitchItem, YnFlag } from '../types';

/**
 * POST /v1/post/counsel/admin/killswitch/save — 점검 Kill-Switch 저장(upsert)
 *
 * 수정자 사번은 바디로 받지 않고 토큰에서 채운다.
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
