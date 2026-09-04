import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';
import { withEmnb } from '../../_lib/headers';

import type { ApiResponse } from '../types';
import type { PromptCreateRequest, PromptCreateResponse } from './dto';

/**
 * 프롬프트를 등록한다. 코드조합 중복 여부는 checkPromptDuplicate로 먼저 확인한다.
 *
 * @param emnb 등록자 사번 — 요청 본문 emnb 필드로 보낸다(필수)
 */
export const createPrompt = async (data: PromptCreateRequest, emnb: string) => {
  const url = NAB_CUSTOMER_TOUCH_API.promptCreate;
  const response = await axiosInstance.post<ApiResponse<PromptCreateResponse>>(url, withEmnb(data, emnb));
  return response.data;
};
