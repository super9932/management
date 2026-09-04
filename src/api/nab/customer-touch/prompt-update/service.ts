import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';
import { withEmnb } from '../../_lib/headers';

import type { ApiResponse } from '../types';
import type { PromptUpdateRequest, PromptUpdateResponse } from './dto';

/**
 * 프롬프트를 수정한다(전량 교체).
 *
 * @param emnb 수정자 사번 — 요청 본문 emnb 필드로 보낸다(필수)
 */
export const updatePrompt = async (data: PromptUpdateRequest, emnb: string) => {
  const url = NAB_CUSTOMER_TOUCH_API.promptUpdate;
  const response = await axiosInstance.post<ApiResponse<PromptUpdateResponse>>(url, withEmnb(data, emnb));
  return response.data;
};
