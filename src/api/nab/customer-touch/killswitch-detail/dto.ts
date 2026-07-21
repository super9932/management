import type { KillSwitchItem } from '../types';

/** POST /v1/get/customer/admin/touch/killswitch/detail — Kill-Switch 상세 조회 */

export interface KillSwitchDetailRequest {
  featureCode: string;
}

export interface KillSwitchDetailResponse {
  killSwitch: KillSwitchItem;
}
