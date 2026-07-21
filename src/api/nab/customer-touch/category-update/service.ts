import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { CategoryUpdateRequest, CategoryUpdateResponse } from './dto';

/** 컨텐츠 카테고리를 수정한다. */
export const updateCategory = async (data: CategoryUpdateRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.categoryUpdate;
  const response = await axiosInstance.post<ApiResponse<CategoryUpdateResponse>>(url, data);
  return response.data;
};
