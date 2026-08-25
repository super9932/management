import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptCategoriesResponse } from './dto';

/** 카테고리(1-depth)와 각 카테고리의 항목(2-depth) 후보를 조회한다. 요청 파라미터 없음. */
export const getPromptCategories = async () => {
  const url = NAB_CUSTOMER_TOUCH_API.promptCategories;
  const response = await axiosInstance.post<ApiResponse<PromptCategoriesResponse>>(url);
  return response.data;
};
