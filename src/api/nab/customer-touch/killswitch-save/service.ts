import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { KillSwitchSaveRequest, KillSwitchSaveResponse } from './dto';

/** 선택된 기능의 Kill-Switch를 저장/갱신한다 (upsert). */
export const saveKillSwitch = async (data: KillSwitchSaveRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.killSwitchSave;
  const response = await axiosInstance.post<ApiResponse<KillSwitchSaveResponse>>(url, data);
  return response.data;
};
