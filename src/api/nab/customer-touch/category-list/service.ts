import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { CategoryListRequest, CategoryListResponse } from './dto';

/** 카테고리 목록을 조회한다 (useYn 미지정 시 전체). */
export const getCategoryList = async (data: CategoryListRequest = {}) => {
  const url = NAB_CUSTOMER_TOUCH_API.categoryList;
  const response = await axiosInstance.post<ApiResponse<CategoryListResponse>>(url, data);
  return response.data;
};
