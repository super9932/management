import type { KillSwitchItem } from '../types';

/** POST /v1/get/customer/admin/touch/killswitch/list — Kill-Switch 목록 조회 */

export interface KillSwitchListRequest {
  /** 기능코드/기능명 검색어 (미지정 = 전체) */
  keyword?: string;
}

export interface KillSwitchListResponse {
  killSwitches: KillSwitchItem[];
}
