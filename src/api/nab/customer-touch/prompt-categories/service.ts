import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { PromptCategoriesResponse } from './dto';

/** 카테고리(1-depth)와 각 카테고리의 항목(2-depth) 후보를 조회한다. 요청 파라미터 없음. */
export const getPromptCategories = async () => {
  const url = NAB_CUSTOMER_TOUCH_API.promptCategories;
  // 요청 파라미터가 없지만 빈 객체를 실어 보낸다.
  // 본문 없는 POST 는 Content-Length 가 붙지 않아, 앞단 프록시·게이트웨이가
  // 잘못된 요청으로 보고 막는 경우가 있다(서버는 어느 쪽이든 동일하게 처리한다).
  const response = await axiosInstance.post<ApiResponse<PromptCategoriesResponse>>(url, {});
  return response.data;
};
