import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';
import { withEmnb } from '../../_lib/headers';

import type { ApiResponse } from '../types';
import type { StipulationSaveRequest, StipulationSaveResponse } from './dto';

/**
 * 약관문서를 등록한다 (multipart/form-data).
 * meta 파트에는 작업자 사번(emnb)이 들어간다.
 */
export const saveStipulation = async ({ pdfFile, csvFile }: StipulationSaveRequest, emnb: string) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.stipulationSave;

  const formData = new FormData();
  if (pdfFile) formData.append('pdfFile', pdfFile);
  if (csvFile) formData.append('csvFile', csvFile);
  // meta 파트는 사번만 담는다 (스웨거상 emnb 가 유일한 필수 필드다)
  formData.append(
    'meta',
    new Blob([JSON.stringify(withEmnb({}, emnb))], { type: 'application/json' }),
  );

  const response = await axiosInstance.post<ApiResponse<StipulationSaveResponse>>(url, formData, {
    // axiosInstance 기본 헤더가 application/json 이라 그대로 두면 boundary 가 빠져 서버가 파싱하지 못한다.
    // undefined 로 지워 브라우저가 multipart/form-data; boundary=... 를 직접 채우게 한다.
    headers: { 'Content-Type': undefined },
  });
  return response.data;
};
