import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { MsgeStatRequest, MsgeStatResponse } from './dto';

/** 메시지 통계 목록을 조회한다 (기간 필터, page 는 1-base). 전체 건수는 엔벨로프 page 에 담긴다. */
export const getMsgeStatList = async (data: MsgeStatRequest = {}) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.statsMessageList;
  const response = await axiosInstance.post<ApiResponse<MsgeStatResponse>>(url, data);
  return response.data;
};
