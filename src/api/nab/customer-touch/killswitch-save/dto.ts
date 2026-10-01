import type { KillSwitchItem, KillSwitchState } from '../types';

/**
 * POST /v1/post/customer/admin/touch/killswitch/save — Kill-Switch 상세 갱신 (upsert)
 *
 * 요청자(변경자) 사번 `emnb` 는 스웨거상 필수 본문 필드로 updatedBy 에 그대로 저장된다.
 * 이 타입에는 두지 않고 service(saveKillSwitch)가 두 번째 인자로 받아 withEmnb 로 얹는다.
 */
export interface KillSwitchSaveRequest {
  /** 기능코드 — 최대 100자 */
  featureCode: string;
  /** 기능명 — 최대 200자 */
  featureName?: string;
  /** ENABLED / DISABLED 이진값 */
  state: KillSwitchState;
  /** 설명(차단 사유 등) — 최대 500자 */
  description?: string;
}

export interface KillSwitchSaveResponse {
  killSwitch: KillSwitchItem;
  /** true = 신규 생성(createdAt 과 updatedAt 이 같다), false = 기존 갱신 */
  created: boolean;
}
