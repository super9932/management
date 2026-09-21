import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { ManualClsfListResponse } from './dto';

/** 매뉴얼 분류 전체 목록을 조회한다. 요청 본문이 없다(스웨거 명시). */
export const getManualClsfList = async () => {
  const url = NAB_COUNSEL_BACKOFFICE_API.manualClsfList;
  const response = await axiosInstance.post<ApiResponse<ManualClsfListResponse>>(url, {});
  return response.data;
};
