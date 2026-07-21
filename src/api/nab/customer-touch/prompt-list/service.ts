import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptListRequest, PromptListResponse } from './dto';

/** 프롬프트 목록을 조회한다 (categoryCode/useYn 미지정 시 전체). 페이지네이션 없음. */
export const getPromptList = async (data: PromptListRequest = {}) => {
  const url = NAB_CUSTOMER_TOUCH_API.promptList;
  const response = await axiosInstance.post<ApiResponse<PromptListResponse>>(url, data);
  return response.data;
};
