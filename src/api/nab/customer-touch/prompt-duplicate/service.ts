import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptDuplicateRequest, PromptDuplicateResponse } from './dto';

/** 코드조합(카테고리·어조·상황·관계·관심사) 중복 여부를 확인한다. 등록/수정 저장 전에 호출한다. */
export const checkPromptDuplicate = async (data: PromptDuplicateRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.promptDuplicate;
  const response = await axiosInstance.post<ApiResponse<PromptDuplicateResponse>>(url, data);
  return response.data;
};
