import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { StatsMessageDailyRequest, StatsMessageDailyResponse } from './dto';

/** 기간·진입점·생성유형·FP유형으로 일자별 메시지 생성 집계를 조회한다. */
export const getStatsMessageDaily = async (data: StatsMessageDailyRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.statsMessageDaily;
  const response = await axiosInstance.post<ApiResponse<StatsMessageDailyResponse>>(url, data);
  return response.data;
};
