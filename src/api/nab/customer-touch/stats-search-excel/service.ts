import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { StatsSearchExcelRequest, StatsSearchExcelResponse } from './dto';

/**
 * 일자별 콘텐츠 검색 집계를 xlsx 바이너리로 내려받는다.
 * 다른 관리자 API와 달리 ApiResponse 엔벨로프가 아닌 Blob을 그대로 반환한다.
 */
export const downloadStatsSearchExcel = async (data: StatsSearchExcelRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.statsSearchExcel;
  const response = await axiosInstance.post<StatsSearchExcelResponse>(url, data, {
    responseType: 'blob',
  });
  return response.data;
};
