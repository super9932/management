import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptGetRequest, PromptGetResponse } from './dto';

/** 프롬프트 단건을 조회한다. */
export const getPrompt = async (data: PromptGetRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.promptGet;
  const response = await axiosInstance.post<ApiResponse<PromptGetResponse>>(url, data);
  return response.data;
};
