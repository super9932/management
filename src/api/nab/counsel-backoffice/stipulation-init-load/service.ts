import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';
import { withEmnb } from '../../_lib/headers';

import type { ApiResponse } from '../types';
import type { StipulationInitLoadRequest, StipulationInitLoadResponse } from './dto';

/** Storage 에 올라가 있는 약관 PDF·CSV 쌍을 키 목록으로 일괄 적재한다(운영 초기 이관용). */
export const initLoadStipulations = async (data: StipulationInitLoadRequest, emnb: string) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.stipulationInitLoad;
  const response = await axiosInstance.post<ApiResponse<StipulationInitLoadResponse>>(url, withEmnb(data, emnb));
  return response.data;
};
