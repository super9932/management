import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { ContentNahUpdateRequest, ContentNahUpdateResponse } from './dto';

/** NAH 콘텐츠를 부분 수정한다. description 영향 필드 변경 시 재색인이 비동기로 돈다. */
export const updateContentNah = async (data: ContentNahUpdateRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.contentNahUpdate;
  const response = await axiosInstance.post<ApiResponse<ContentNahUpdateResponse>>(url, data);
  return response.data;
};
