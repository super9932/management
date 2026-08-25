import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { StipulationDeleteRequest, StipulationDeleteResponse } from './dto';

/**
 * 약관문서를 소프트삭제한다 (다건).
 * AI BE 색인 삭제에 실패한 문서는 failedList 로 돌아오며 목록에 그대로 남는다 — 재요청하면 된다.
 */
export const deleteStipulation = async (data: StipulationDeleteRequest) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.stipulationDelete;
  const response = await axiosInstance.post<ApiResponse<StipulationDeleteResponse>>(url, data);
  return response.data;
};
