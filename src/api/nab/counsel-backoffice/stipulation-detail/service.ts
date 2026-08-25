import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { StipulationDetailRequest, StipulationDetailResponse } from './dto';

/** 약관문서 상세를 조회한다. PDF·CSV 다운로드 URL 은 만료가 있어 그때그때 다시 받아야 한다. */
export const getStipulationDetail = async (data: StipulationDetailRequest) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.stipulationDetail;
  const response = await axiosInstance.post<ApiResponse<StipulationDetailResponse>>(url, data);
  return response.data;
};
