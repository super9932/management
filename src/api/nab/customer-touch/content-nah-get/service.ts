import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { ContentNahGetRequest, ContentNahGetResponse } from './dto';

/** NAH 콘텐츠 단건을 조회한다. 등록/수정 후 contentStatus 폴링에도 사용한다. */
export const getContentNah = async (data: ContentNahGetRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.contentNahGet;
  const response = await axiosInstance.post<ApiResponse<ContentNahGetResponse>>(url, data);
  return response.data;
};
