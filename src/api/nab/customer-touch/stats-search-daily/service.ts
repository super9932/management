import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { StatsSearchDailyRequest, StatsSearchDailyResponse } from './dto';

/** 기간·FP유형으로 일자별 콘텐츠 검색 집계를 조회한다. */
export const getStatsSearchDaily = async (data: StatsSearchDailyRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.statsSearchDaily;
  const response = await axiosInstance.post<ApiResponse<StatsSearchDailyResponse>>(url, data);
  return response.data;
};
