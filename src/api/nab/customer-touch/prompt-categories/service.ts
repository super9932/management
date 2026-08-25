import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptTypesResponse } from './dto';

/** 등록 화면 셀렉트박스 소스 — 유형 코드와 카테고리 규약을 조회한다. 요청 파라미터 없음. */
export const getPromptTypes = async () => {
  const url = NAB_CUSTOMER_TOUCH_API.promptTypes;
  const response = await axiosInstance.post<ApiResponse<PromptTypesResponse>>(url);
  return response.data;
};
