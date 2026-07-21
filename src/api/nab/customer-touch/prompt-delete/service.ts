import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptDeleteRequest, PromptDeleteResponse } from './dto';

/** 프롬프트를 삭제한다. */
export const deletePrompt = async (data: PromptDeleteRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.promptDelete;
  const response = await axiosInstance.post<ApiResponse<PromptDeleteResponse>>(url, data);
  return response.data;
};
