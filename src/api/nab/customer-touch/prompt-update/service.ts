import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptUpdateRequest, PromptUpdateResponse } from './dto';

/** 프롬프트를 수정한다. */
export const updatePrompt = async (data: PromptUpdateRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.promptUpdate;
  const response = await axiosInstance.post<ApiResponse<PromptUpdateResponse>>(url, data);
  return response.data;
};
