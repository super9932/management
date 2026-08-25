import type { KillSwitchItem, KillSwitchState } from '../types';

/**
 * POST /v1/post/customer/admin/touch/killswitch/save — Kill-Switch 상세 갱신 (upsert)
 *
 * 수정자(updatedBy)는 바디로 받지 않고 토큰에서 채운다 — 응답 KillSwitchItem에만 실린다.
 */
export interface KillSwitchSaveRequest {
  /** 최대 100자 */
  featureCode: string;
  /** 최대 200자 */
  featureName?: string;
  /** ENABLED / DISABLED 이진값 */
  state: KillSwitchState;
  /** 최대 500자 */
  description?: string;
}

export interface KillSwitchSaveResponse {
  killSwitch: KillSwitchItem;
  /** true = 신규 생성, false = 기존 갱신 */
  created: boolean;
}
