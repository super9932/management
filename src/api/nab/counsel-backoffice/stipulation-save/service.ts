import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { StipulationSaveRequest, StipulationSaveResponse } from './dto';

/**
 * 약관문서를 등록한다 (multipart/form-data).
 * meta 파트는 현재 담을 값이 없어 보내지 않는다 — 스웨거에도 빈 객체로 정의돼 있다.
 */
export const saveStipulation = async ({ pdfFile, csvFile }: StipulationSaveRequest) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.stipulationSave;

  const formData = new FormData();
  if (pdfFile) formData.append('pdfFile', pdfFile);
  if (csvFile) formData.append('csvFile', csvFile);

  const response = await axiosInstance.post<ApiResponse<StipulationSaveResponse>>(url, formData);
  return response.data;
};
