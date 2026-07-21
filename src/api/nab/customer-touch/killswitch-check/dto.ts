/** POST /v1/get/customer/admin/touch/killswitch/check — Kill-Switch 일괄 체크 */

export interface KillSwitchCheckRequest {
  featureCodes: string[];
}

export interface KillSwitchCheckResponse {
  /** featureCode → 활성화 여부 (true = ENABLED) */
  enabled: Record<string, boolean>;
}
