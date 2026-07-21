import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { CategoryGetRequest, CategoryGetResponse } from './dto';

/** 카테고리 단건을 조회한다. */
export const getCategory = async (data: CategoryGetRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.categoryGet;
  const response = await axiosInstance.post<ApiResponse<CategoryGetResponse>>(url, data);
  return response.data;
};
