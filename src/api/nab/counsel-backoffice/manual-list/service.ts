import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { ManualListRequest, ManualListResponse } from './dto';

/** 매뉴얼문서 목록을 조회한다. 관리주체(nabCuslAdmrTypeCode)가 필수다. */
export const getManualList = async (data: ManualListRequest) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.manualList;
  const response = await axiosInstance.post<ApiResponse<ManualListResponse>>(url, data);
  return response.data;
};
