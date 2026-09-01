import type { CounselKillSwitchItem } from '../types';

/** POST /v1/get/counsel/admin/killswitch/detail — 점검 Kill-Switch 상세 조회 */

export interface CounselKillSwitchDetailRequest {
  /** 기능점검코드 */
  ftreIspcCode: string;
}

export interface CounselKillSwitchDetailResponse {
  killSwitch: CounselKillSwitchItem;
}
