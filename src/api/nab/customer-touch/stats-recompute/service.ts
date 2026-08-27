import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { StatsRecomputeRequest, StatsRecomputeResponse } from './dto';

/** 지정 구간의 통계 확정 저장을 지운다. 값은 다음 daily 조회가 다시 계산한다. */
export const recomputeStats = async (data: StatsRecomputeRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.statsRecompute;
  const response = await axiosInstance.post<ApiResponse<StatsRecomputeResponse>>(url, data);
  return response.data;
};
