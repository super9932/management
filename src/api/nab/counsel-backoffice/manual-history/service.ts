import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { ManualHistoryRequest, ManualHistoryResponse } from './dto';

/** 매뉴얼문서 수정 이력을 최신순으로 조회한다 (상세 팝업의 '수정 이력' 탭). */
export const getManualHistoryList = async (data: ManualHistoryRequest) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.manualHistoryList;
  const response = await axiosInstance.post<ApiResponse<ManualHistoryResponse>>(url, data);
  return response.data;
};
