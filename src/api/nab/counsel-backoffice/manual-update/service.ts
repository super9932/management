import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';
import { withEmnb } from '../../_lib/headers';

import type { ApiResponse } from '../types';
import type { ManualUpdateRequest, ManualUpdateResponse } from './dto';

/**
 * 매뉴얼문서의 적용기간을 수정한다.
 * valdEndDttm 을 null 로 보내면 '무기한'으로 바뀐다 — 값을 빼면 미변경이 아니라 무기한이 되므로 주의한다.
 */
export const updateManual = async (data: ManualUpdateRequest, emnb: string) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.manualUpdate;
  const response = await axiosInstance.post<ApiResponse<ManualUpdateResponse>>(url, withEmnb(data, emnb));
  return response.data;
};
