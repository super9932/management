import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';
import { withEmnb } from '../../_lib/headers';

import type { ApiResponse } from '../types';
import type { PromptDeleteRequest, PromptDeleteResponse } from './dto';

/**
 * 프롬프트를 삭제한다.
 *
 * @param emnb 삭제자 사번 — 요청 본문 emnb 필드로 보낸다(필수)
 */
export const deletePrompt = async (data: PromptDeleteRequest, emnb: string) => {
  const url = NAB_CUSTOMER_TOUCH_API.promptDelete;
  const response = await axiosInstance.post<ApiResponse<PromptDeleteResponse>>(url, withEmnb(data, emnb));
  return response.data;
};
