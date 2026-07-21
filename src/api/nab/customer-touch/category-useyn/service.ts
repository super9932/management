import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { CategoryUseYnRequest, CategoryUseYnResponse } from './dto';

/** 카테고리 사용여부(Y/N)를 토글한다. */
export const toggleCategoryUseYn = async (data: CategoryUseYnRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.categoryUseYn;
  const response = await axiosInstance.post<ApiResponse<CategoryUseYnResponse>>(url, data);
  return response.data;
};
