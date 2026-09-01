import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { ManualInitLoadRequest, ManualInitLoadResponse } from './dto';

/** Storage 에 올라가 있는 매뉴얼문서를 키 목록으로 일괄 적재한다(운영 초기 이관용). */
export const initLoadManuals = async (data: ManualInitLoadRequest) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.manualInitLoad;
  const response = await axiosInstance.post<ApiResponse<ManualInitLoadResponse>>(url, data);
  return response.data;
};
