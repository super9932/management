import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { KillSwitchListRequest, KillSwitchListResponse } from './dto';

/** Kill-Switch 목록을 조회한다 (keyword 미지정 시 전체). */
export const getKillSwitchList = async (data: KillSwitchListRequest = {}) => {
  const url = NAB_CUSTOMER_TOUCH_API.killSwitchList;
  const response = await axiosInstance.post<ApiResponse<KillSwitchListResponse>>(url, data);
  return response.data;
};
