import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { MsgeStatExcelRequest, MsgeStatExcelResponse } from './dto';

/**
 * 메시지 통계를 xlsx 바이너리로 내려받는다.
 * 다른 백오피스 API 와 달리 ApiResponse 엔벨로프가 아닌 Blob 을 그대로 반환한다.
 */
export const downloadMsgeStatExcel = async (data: MsgeStatExcelRequest = {}) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.statsMessageExcel;
  const response = await axiosInstance.post<MsgeStatExcelResponse>(url, data, {
    responseType: 'blob',
  });
  return response.data;
};
