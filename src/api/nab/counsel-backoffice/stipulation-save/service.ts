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

  const response = await axiosInstance.post<ApiResponse<StipulationSaveResponse>>(url, formData, {
    // axiosInstance 기본 헤더가 application/json 이라 그대로 두면 boundary 가 빠져 서버가 파싱하지 못한다.
    // undefined 로 지워 브라우저가 multipart/form-data; boundary=... 를 직접 채우게 한다.
    headers: { 'Content-Type': undefined },
  });
  return response.data;
};
