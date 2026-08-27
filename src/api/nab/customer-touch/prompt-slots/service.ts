import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptSlotsResponse } from './dto';

/** 카탈로그 슬롯 29종의 등록 현황을 조회한다. 요청 파라미터 없음. */
export const getPromptSlots = async () => {
  const url = NAB_CUSTOMER_TOUCH_API.promptSlots;
  const response = await axiosInstance.post<ApiResponse<PromptSlotsResponse>>(url);
  return response.data;
};
