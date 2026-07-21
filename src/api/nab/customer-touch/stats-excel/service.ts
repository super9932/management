import axiosInstance from '../../../../utils/axios';
import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { StatsExcelRequest, StatsExcelResponse } from './dto';

/**
 * 생성내역(FP·고객·적용옵션·본문·일시)을 기간 필터로 xlsx 바이너리로 내려받는다.
 * 다른 관리자 API와 달리 ApiResponse 엔벨로프가 아닌 Blob을 그대로 반환한다.
 */
export const downloadStatsExcel = async (data: StatsExcelRequest) => {
  const url = NAB_CUSTOMER_TOUCH_API.statsExcel;
  const response = await axiosInstance.post<StatsExcelResponse>(url, data, {
    responseType: 'blob',
  });
  return response.data;
};
