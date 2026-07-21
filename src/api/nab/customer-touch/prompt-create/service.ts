import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptCreateRequest, PromptCreateResponse } from './dto';

/** 프롬프트를 등록한다. 코드조합 중복 여부는 checkPromptDuplicate로 먼저 확인한다. */
export const createPrompt = async (data: PromptCreateRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.promptCreate;
  const response = await axiosInstance.post<ApiResponse<PromptCreateResponse>>(url, data);
  return response.data;
};
