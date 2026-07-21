import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { StatsMessagesRequest, StatsMessagesResponse } from './dto';

/** 생성내역(FP·고객·적용옵션·본문·생성일시)을 기간 필터로 최신순 페이지네이션 조회한다. */
export const getStatsMessages = async (data: StatsMessagesRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.statsMessages;
  const response = await axiosInstance.post<ApiResponse<StatsMessagesResponse>>(url, data);
  return response.data;
};
