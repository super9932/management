import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';
import { repairMangledBinary } from '../../_lib/binary';

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
  // 바이패스 계층이 문자셋 변환으로 망가뜨린 경우에만 원래 바이트로 되돌린다
  return repairMangledBinary(response.data);
};
