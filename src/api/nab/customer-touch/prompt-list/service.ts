import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptListRequest, PromptListResponse } from './dto';

/** 프롬프트 목록을 조회한다 (기간·유형·카테고리·사용여부·검색어 필터, page는 1-base). */
export const getPromptList = async (data: PromptListRequest = {}) => {
  const url = NAB_CUSTOMER_TOUCH_API.promptList;
  const response = await axiosInstance.post<ApiResponse<PromptListResponse>>(url, data);
  return response.data;
};
