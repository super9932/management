import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { StatsAggregateRequest, StatsAggregateResponse } from './dto';

/** 일배치 누락/실패 복구용 — 기간을 지정해 통계를 즉시 재집계한다. 멱등. */
export const aggregateStats = async (data: StatsAggregateRequest = {}) => {
  const url = NAB_CUSTOMER_TOUCH_API.statsAggregate;
  const response = await axiosInstance.post<ApiResponse<StatsAggregateResponse>>(url, data);
  return response.data;
};
