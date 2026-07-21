import type { KillSwitchItem, KillSwitchState } from '../types';

/** POST /v1/post/customer/admin/touch/killswitch/save — Kill-Switch 상세 갱신 (upsert) */

export interface KillSwitchSaveRequest {
  featureCode: string;
  featureName?: string;
  /** ENABLED / DISABLED 이진값 */
  state: KillSwitchState;
  description?: string;
  updatedBy?: string;
}

export interface KillSwitchSaveResponse {
  killSwitch: KillSwitchItem;
  /** true = 신규 생성, false = 기존 갱신 */
  created: boolean;
}
