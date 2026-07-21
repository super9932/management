import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { StatsSummaryRequest, StatsSummaryResponse } from './dto';

/** 기간 필터로 생성·발송·열람·검색·고객 수 요약을 조회한다. */
export const getStatsSummary = async (data: StatsSummaryRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.statsSummary;
  const response = await axiosInstance.post<ApiResponse<StatsSummaryResponse>>(url, data);
  return response.data;
};
