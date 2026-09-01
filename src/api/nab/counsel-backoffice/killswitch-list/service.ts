import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { CounselKillSwitchListRequest, CounselKillSwitchListResponse } from './dto';

/** 상담AI 점검 Kill-Switch 목록을 조회한다. */
export const getCounselKillSwitchList = async (data: CounselKillSwitchListRequest = {}) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.killSwitchList;
  const response = await axiosInstance.post<ApiResponse<CounselKillSwitchListResponse>>(url, data);
  return response.data;
};
