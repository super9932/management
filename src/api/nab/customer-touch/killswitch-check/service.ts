import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { KillSwitchCheckRequest, KillSwitchCheckResponse } from './dto';

/** 여러 기능의 Kill-Switch 활성화 여부를 한 번에 조회한다. */
export const checkKillSwitches = async (data: KillSwitchCheckRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.killSwitchCheck;
  const response = await axiosInstance.post<ApiResponse<KillSwitchCheckResponse>>(url, data);
  return response.data;
};
