import type { KillSwitchItem } from '../types';

/**
 * POST /v1/get/customer/admin/touch/killswitch/detail — Kill-Switch 상세 조회
 *
 * 미등록 기능코드는 HTTP 200 + error 봉투(code: nxl-nab-ks-erro-001, data: null)로 나간다.
 * check 는 같은 코드를 true 로 넘기지만 상세 조회만 오류로 취급한다.
 */

export interface KillSwitchDetailRequest {
  /** 기능코드 — 최대 100자 */
  featureCode: string;
}

export interface KillSwitchDetailResponse {
  killSwitch: KillSwitchItem;
}
