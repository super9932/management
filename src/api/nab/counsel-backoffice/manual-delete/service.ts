import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';
import { withEmnb } from '../../_lib/headers';

import type { ApiResponse } from '../types';
import type { ManualDeleteRequest, ManualDeleteResponse } from './dto';

/**
 * 매뉴얼문서를 소프트삭제한다 (다건).
 * AI BE 색인 삭제에 실패한 문서는 failedList 로 돌아오며 목록에 그대로 남는다 — 재요청하면 된다.
 */
export const deleteManual = async (data: ManualDeleteRequest, emnb: string) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.manualDelete;
  const response = await axiosInstance.post<ApiResponse<ManualDeleteResponse>>(url, withEmnb(data, emnb));
  return response.data;
};
