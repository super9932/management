import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptGuideResponse } from './dto';

/** 단일 글로벌 프롬프트 작성 가이드 본문을 조회한다. 요청 파라미터 없음. */
export const getPromptGuide = async () => {
  const url = NAB_CUSTOMER_TOUCH_API.promptGuide;
  const response = await axiosInstance.post<ApiResponse<PromptGuideResponse>>(url);
  return response.data;
};
