import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { CounselKillSwitchDetailRequest, CounselKillSwitchDetailResponse } from './dto';

/** 상담AI 점검 Kill-Switch 단건을 조회한다. */
export const getCounselKillSwitchDetail = async (data: CounselKillSwitchDetailRequest) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.killSwitchDetail;
  const response = await axiosInstance.post<ApiResponse<CounselKillSwitchDetailResponse>>(url, data);
  return response.data;
};
