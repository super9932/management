/**
 * POST /v1/get/customer/admin/touch/killswitch/check — Kill-Switch 일괄 체크
 *
 * 관리자(BO) 전용 — 형제 엔드포인트와 동일하게 x-api-header 를 요구한다.
 */

export interface KillSwitchCheckRequest {
  /** 기능코드 목록 — 1~50건(빈 배열은 400), 원소당 최대 100자 */
  featureCodes: string[];
}

export interface KillSwitchCheckResponse {
  /**
   * featureCode → 허용 여부.
   * true = 허용(ENABLED 또는 미등록 — fail-open 이라 둘을 구분할 수 없다),
   * false = 차단(명시적 DISABLED 행이 있을 때만)
   */
  enabled: Record<string, boolean>;
}
