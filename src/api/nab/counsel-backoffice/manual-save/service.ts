import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';

import type { ApiResponse } from '../types';
import type { ManualSaveRequest, ManualSaveResponse } from './dto';

/**
 * 매뉴얼문서를 등록한다 (multipart/form-data).
 *
 * meta 는 JSON 파트라 Blob 으로 감싸 Content-Type 을 붙여야 서버가 객체로 역직렬화한다.
 * Content-Type 헤더는 boundary 를 브라우저가 채우도록 지정하지 않는다.
 */
export const saveManual = async ({ file, meta }: ManualSaveRequest) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.manualSave;

  const formData = new FormData();
  if (file) formData.append('file', file);
  formData.append('meta', new Blob([JSON.stringify(meta)], { type: 'application/json' }));

  const response = await axiosInstance.post<ApiResponse<ManualSaveResponse>>(url, formData);
  return response.data;
};
