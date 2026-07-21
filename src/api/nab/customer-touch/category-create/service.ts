import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { CategoryCreateRequest, CategoryCreateResponse } from './dto';

/** 컨텐츠 카테고리를 등록한다. */
export const createCategory = async (data: CategoryCreateRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.categoryCreate;
  const response = await axiosInstance.post<ApiResponse<CategoryCreateResponse>>(url, data);
  return response.data;
};
