import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { StipulationListRequest, StipulationListResponse } from './dto';

/** 약관문서 목록을 조회한다. 페이징 정보는 응답 엔벨로프의 page 필드에 담긴다. */
export const getStipulationList = async (data: StipulationListRequest = {}) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.stipulationList;
  const response = await axiosInstance.post<ApiResponse<StipulationListResponse>>(url, data);
  return response.data;
};
