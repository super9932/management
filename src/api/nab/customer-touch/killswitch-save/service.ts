import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';
import { withEmnb } from '../../_lib/headers';

import type { ApiResponse } from '../types';
import type { KillSwitchSaveRequest, KillSwitchSaveResponse } from './dto';

/**
 * 선택된 기능의 Kill-Switch를 저장/갱신한다 (upsert).
 *
 * @param emnb 작업자 사번 — 요청 본문 emnb 필드로 보낸다(필수)
 */
export const saveKillSwitch = async (data: KillSwitchSaveRequest, emnb: string) => {
  const url = NAB_CUSTOMER_TOUCH_API.killSwitchSave;
  const response = await axiosInstance.post<ApiResponse<KillSwitchSaveResponse>>(url, withEmnb(data, emnb));
  return response.data;
};
