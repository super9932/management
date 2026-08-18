import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { ContentNahRegisterRequest, ContentNahRegisterResponse } from './dto';

/** NAH 콘텐츠를 등록한다. description은 비동기 생성되므로 contentStatus를 폴링한다. */
export const registerContentNah = async (data: ContentNahRegisterRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.contentNahRegister;
  const response = await axiosInstance.post<ApiResponse<ContentNahRegisterResponse>>(url, data);
  return response.data;
};
