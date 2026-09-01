import type { CounselKillSwitchItem } from '../types';

/** POST /v1/get/counsel/admin/killswitch/list — 점검 Kill-Switch 목록 조회 */

export interface CounselKillSwitchListRequest {
  /** 검색어(기능코드/기능명 부분일치). 미입력 시 전체 조회 */
  keyword?: string;
}

export interface CounselKillSwitchListResponse {
  killSwitches: CounselKillSwitchItem[];
}
