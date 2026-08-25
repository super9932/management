import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { ManualDetailRequest, ManualDetailResponse } from './dto';

/** 매뉴얼문서 상세를 조회한다. 파일 다운로드 URL 은 만료가 있어 그때그때 다시 받아야 한다. */
export const getManualDetail = async (data: ManualDetailRequest) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.manualDetail;
  const response = await axiosInstance.post<ApiResponse<ManualDetailResponse>>(url, data);
  return response.data;
};
