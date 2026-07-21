import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { KillSwitchDetailRequest, KillSwitchDetailResponse } from './dto';

/** 기능코드로 Kill-Switch 상세를 조회한다. */
export const getKillSwitchDetail = async (data: KillSwitchDetailRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.killSwitchDetail;
  const response = await axiosInstance.post<ApiResponse<KillSwitchDetailResponse>>(url, data);
  return response.data;
};
